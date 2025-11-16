db = db.getSiblingDB("survey");

// Check if superadmin already exists
const existing = db.users.findOne({
    "user_type": "super_admin"
});

if (!existing) {
    db.users.insertOne({
		"email" : "superadmin@gmail.com",
		"first_name" : "Administrator",
		"last_name" : "Ji",
		"full_name" : "Administrator Ji",
		"slug" : "super-admin-1",
		"password" : "$2b$10$oTwdkvW1JcPijBSKExNRpO/rj6CzXOyqh9E1KoIdxqBVo/3lJ/z7e",
		"user_role_id" : "65fd41b32fd4cd279c9f3045",
		"username" : "superadmin",
		"user_type" : "super_admin",
		"role" : "super_admin",
		"phone" : "123654789",
    });
}