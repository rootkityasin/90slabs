import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  validateAdminKey,
  checkRateLimit,
  getClientIP,
  unauthorizedResponse,
  rateLimitResponse,
  sanitizeString,
  validateInput,
} from "@/lib/auth";

export async function GET() {
  try {
    const db = await getDatabase();
    const servicesDoc = await db.collection("services").findOne({});
    return NextResponse.json(servicesDoc?.categories || []);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

// POST - Add new service to a category
export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return rateLimitResponse();
  }

  if (!validateAdminKey(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();

    const categoryIdCheck = validateInput(body.categoryId, "string", 50);
    const titleCheck = validateInput(body.title, "string", 200);
    const descriptionCheck = validateInput(body.description, "string", 500);
    const iconCheck = validateInput(body.icon, "string", 50);

    if (
      !categoryIdCheck.valid ||
      !titleCheck.valid ||
      !descriptionCheck.valid
    ) {
      return NextResponse.json(
        { error: "Invalid input. Required: categoryId, title, description" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const servicesDoc = await db.collection("services").findOne({});

    if (!servicesDoc) {
      return NextResponse.json(
        { error: "Services data not found" },
        { status: 404 },
      );
    }

    // Find the category and add the service
    const categories = servicesDoc.categories || [];
    const categoryIndex = categories.findIndex(
      (c: { id: string }) => c.id === categoryIdCheck.value,
    );

    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Generate new service ID
    let maxId = 0;
    categories.forEach((cat: { services?: { id: number }[] }) => {
      cat.services?.forEach((s: { id: number }) => {
        if (s.id > maxId) maxId = s.id;
      });
    });

    const newService = {
      id: maxId + 1,
      title: titleCheck.value,
      description: descriptionCheck.value,
      icon: iconCheck.valid ? iconCheck.value : "Globe",
      featured: body.featured === true,
    };

    categories[categoryIndex].services.push(newService);

    await db
      .collection("services")
      .updateOne({ _id: servicesDoc._id }, { $set: { categories } });

    return NextResponse.json(
      { success: true, service: newService },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}

// PUT - Update service or category
export async function PUT(request: NextRequest) {
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return rateLimitResponse();
  }

  if (!validateAdminKey(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const db = await getDatabase();
    const servicesDoc = await db.collection("services").findOne({});

    if (!servicesDoc) {
      return NextResponse.json(
        { error: "Services data not found" },
        { status: 404 },
      );
    }

    const categories = [...servicesDoc.categories];

    // Update category
    if (body.updateCategory && body.categoryId) {
      const catIdx = categories.findIndex(
        (c: { id: string }) => c.id === body.categoryId,
      );
      if (catIdx === -1) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 },
        );
      }

      if (body.title) {
        const check = validateInput(body.title, "string", 100);
        if (check.valid) categories[catIdx].title = check.value;
      }
      if (body.description) {
        const check = validateInput(body.description, "string", 300);
        if (check.valid) categories[catIdx].description = check.value;
      }
    }
    // Update service
    else if (body.serviceId) {
      let found = false;
      for (const cat of categories) {
        const svcIdx = cat.services?.findIndex(
          (s: { id: number }) => s.id === body.serviceId,
        );
        if (svcIdx !== undefined && svcIdx !== -1) {
          if (body.title) {
            const check = validateInput(body.title, "string", 200);
            if (check.valid) cat.services[svcIdx].title = check.value;
          }
          if (body.description) {
            const check = validateInput(body.description, "string", 500);
            if (check.valid) cat.services[svcIdx].description = check.value;
          }
          if (body.icon) {
            const check = validateInput(body.icon, "string", 50);
            if (check.valid) cat.services[svcIdx].icon = check.value;
          }
          if (typeof body.featured === "boolean") {
            cat.services[svcIdx].featured = body.featured;
          }
          found = true;
          break;
        }
      }
      if (!found) {
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 },
        );
      }
    } else {
      return NextResponse.json(
        { error: "Specify serviceId or categoryId with updateCategory" },
        { status: 400 },
      );
    }

    await db
      .collection("services")
      .updateOne({ _id: servicesDoc._id }, { $set: { categories } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 },
    );
  }
}

// DELETE - Remove service
export async function DELETE(request: NextRequest) {
  const ip = getClientIP(request);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return rateLimitResponse();
  }

  if (!validateAdminKey(request)) {
    return unauthorizedResponse();
  }

  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get("serviceId");

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID required" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const servicesDoc = await db.collection("services").findOne({});

    if (!servicesDoc) {
      return NextResponse.json(
        { error: "Services data not found" },
        { status: 404 },
      );
    }

    const categories = [...servicesDoc.categories];
    let deleted = false;

    for (const cat of categories) {
      const initialLength = cat.services?.length || 0;
      cat.services = cat.services?.filter(
        (s: { id: number }) => s.id !== parseInt(serviceId),
      );
      if (cat.services?.length < initialLength) {
        deleted = true;
        break;
      }
    }

    if (!deleted) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await db
      .collection("services")
      .updateOne({ _id: servicesDoc._id }, { $set: { categories } });

    return NextResponse.json({ success: true, deleted: serviceId });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 },
    );
  }
}
