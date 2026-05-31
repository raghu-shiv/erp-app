import { prisma } from "../src/lib/db";
import { UserRole } from "@prisma/client";
import { auth } from "../src/lib/auth";
import bcrypt from "bcryptjs";

async function ensureUser({
  name,
  email,
  password,
  role,
  pin,
}: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  pin?: string;
}) {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });
    user = await prisma.user.findUniqueOrThrow({ where: { email } });
  }

  return prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      role,
      isActive: true,
      pin: pin ? await bcrypt.hash(pin, 10) : user.pin,
    },
  });
}

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Create default Admin user ───
  const admin = await ensureUser({
    name: "System Admin",
    email: "admin@erp.local",
    password: "admin123",
    pin: "1234",
    role: UserRole.ADMIN,
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // ─── Create a Cashier user ───
  const cashier = await ensureUser({
    name: "Default Cashier",
    email: "cashier@erp.local",
    password: "cashier123",
    pin: "5678",
    role: UserRole.CASHIER,
  });
  console.log(`  ✅ Cashier user: ${cashier.email}`);

  // ─── Create a Manager user ───
  const manager = await ensureUser({
    name: "Store Manager",
    email: "manager@erp.local",
    password: "manager123",
    role: UserRole.MANAGER,
  });
  console.log(`  ✅ Manager user: ${manager.email}`);

  // ─── Create Categories ───
  const categories = await Promise.all(
    ["Groceries", "Electronics", "Clothing", "Beverages", "Health & Medicine"].map(
      (name) =>
        prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        })
    )
  );
  console.log(`  ✅ Categories: ${categories.length} created`);

  // ─── Create a Supplier ───
  const supplier = await prisma.supplier.upsert({
    where: { id: "seed-supplier-001" },
    update: {},
    create: {
      id: "seed-supplier-001",
      name: "Global Distributors",
      contactName: "Rajesh Kumar",
      phone: "+91-9876543210",
      email: "supply@globaldist.com",
      address: "Sector 5, Industrial Area, Delhi",
    },
  });
  console.log(`  ✅ Supplier: ${supplier.name}`);

  // ─── Create Sample Products ───
  const products = [
    {
      name: "Basmati Rice 5kg",
      sku: "GRO-001",
      barcode: "8901234560001",
      price: 450.0,
      costPrice: 380.0,
      taxRate: 5.0,
      hsnCode: "1006",
      unit: "PKT",
      stockQuantity: 100,
      minStockAlert: 20,
      categoryId: categories[0].id,
      supplierId: supplier.id,
    },
    {
      name: "Wireless Bluetooth Earbuds",
      sku: "ELE-001",
      barcode: "8901234560002",
      price: 1299.0,
      costPrice: 850.0,
      taxRate: 18.0,
      hsnCode: "8518",
      unit: "PCS",
      stockQuantity: 50,
      minStockAlert: 10,
      categoryId: categories[1].id,
      supplierId: supplier.id,
    },
    {
      name: "Cotton T-Shirt (L)",
      sku: "CLO-001",
      barcode: "8901234560003",
      price: 599.0,
      costPrice: 280.0,
      taxRate: 5.0,
      hsnCode: "6109",
      unit: "PCS",
      stockQuantity: 200,
      minStockAlert: 30,
      categoryId: categories[2].id,
      supplierId: supplier.id,
    },
    {
      name: "Cold Brew Coffee 330ml",
      sku: "BEV-001",
      barcode: "8901234560004",
      price: 120.0,
      costPrice: 65.0,
      taxRate: 12.0,
      hsnCode: "0901",
      unit: "BTL",
      stockQuantity: 80,
      minStockAlert: 15,
      categoryId: categories[3].id,
      supplierId: supplier.id,
      expiryDate: new Date("2027-06-30"),
    },
    {
      name: "Paracetamol 500mg (10 tablets)",
      sku: "MED-001",
      barcode: "8901234560005",
      price: 35.0,
      costPrice: 15.0,
      taxRate: 12.0,
      hsnCode: "3004",
      unit: "STRIP",
      stockQuantity: 500,
      minStockAlert: 50,
      categoryId: categories[4].id,
      supplierId: supplier.id,
      expiryDate: new Date("2028-12-31"),
      batchNumber: "BATCH-2025-A1",
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }
  console.log(`  ✅ Products: ${products.length} created`);

  console.log("\n🎉 Seed complete!");
  console.log("  📧 Admin login:   admin@erp.local / admin123");
  console.log("  📧 Cashier login:  cashier@erp.local / cashier123");
  console.log("  📧 Manager login:  manager@erp.local / manager123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
