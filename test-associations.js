require("dotenv").config();
const { User, Provider, Patient, PatientProvider } = require("./models");

(async () => {
  try {
    // Create a new provider and user(nested)
    const provider = await Provider.create({
      User: {
        iamId: "091238019238",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
        phoneNumber: "8822888882",
        isActive: true,
      },
    });
    // Create a new patient and user(nested)
    const patient = await Patient.create({
      User: {
        iamId: "139182398128",
        firstName: "Alicia",
        lastName: "Keys",
        email: "aliciakeys@gmail.com",
        phoneNumber: "99299299992",
        isActive: true,
      },
    });
    // Connect the provider with patient (specific to n-m relations )
    await patient.addProvider(provider);
    console.log("\n\n------------- PROVIDER ------------------\n\n");
    // Check provider
    const patientProvider = await Provider.findOne({
      where: { id: 1 },
      include: [{ model: Patient }],
    });
    console.log(patientProvider.toJSON());
    console.log(
      "\n\n------------- ASSOCIATION (JOIN TABLE) ------------------\n\n"
    );
    const association = await PatientProvider.findOne({
      where: {
        patientId: 1,
        providerId: 1,
      },
    });
    console.log(association.toJSON());
  } catch (err) {
    console.log(err);
  }
})();
