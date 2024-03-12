document.addEventListener("DOMContentLoaded", () => {
    const viewDoctorsBtn = document.getElementById("viewDoctorsBtn");
    const doctorListDiv = document.getElementById("doctorList");
  
    viewDoctorsBtn.addEventListener("click", async () => {
      try {
        const response = await fetch(`http://localhost:3001/doctors`);
        const doctorList = await response.json();
  
        // Parse JSON data here
        const parsedDoctorList = JSON.parse(doctorList);
  
        // Display list of doctors
        doctorListDiv.innerHTML = "<h2>Doctor List</h2>";
        parsedDoctorList.forEach((doctor, index) => {
          doctorListDiv.innerHTML += `
            <div>
              <h3>Doctor ${index + 1}</h3>
              <p>Doctor SSN: ${doctor[0]}</p>
              <p>Doctor Meta: ${doctor[1]}</p>
            </div>
          `;
        });
      } catch (error) {
        console.error("Error fetching doctor list:", error.message);
        doctorListDiv.textContent = "Error fetching doctor list";
      }
    });
  });
  