var db = connect("localhost:27017/ITLDP");

db.users.save({
    _id: NumberInt(40000),
    RoleName: "Customer",
    UserName: "customer",
    Password: "customer123",
    FirstName: "Harvard",
    LastName: "Anderson",
    Street: "9550 Malcolm X Boulevard",
    City: "Bellevue",
    Province: "WA",
    PostalCode: "98006",
    Email: "customer@gmail.com",
    Phone: "(688) 408-5919",
    CustomerName: "Bellevue Regional Hospital",
    CustomerType: "Hospital",
    ContractType: "Critical Care",
    CountryName: "United States",
    RegionName: "Northwest",
    Position: "Nurse"
});

db.users.save({
    _id: NumberInt(50000),
    RoleName: "Onsite Engineer",
    UserName: "engineer",
    Password: "engineer123",
    FirstName: "Yale",
    LastName: "Henderson",
    Street: "3195 Parkside Court",
    City: "Bellevue",
    Province: "WA",
    PostalCode: "98006",
    Email: "engineer@gmail.com",
    Phone: "(634) 838-6666",
    CustomerName: "Bridgeport Dental Practice",
    CustomerType: "Dentist Office",
    ContractType: "Critical Care",
    CountryName: "United States",
    RegionName: "Northwest",
    Position: "Head Nurse"
});