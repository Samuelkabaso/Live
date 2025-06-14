// Navigate Screens
onEvent("SignUp", "click", function() {
  setScreen("SelectAccount");
});
onEvent("adminBackButton", "click", function( ) {
  setScreen("HOME");
});
onEvent("Backbuttonselectaccount", "click", function( ) {
  setScreen("HOME");
});
onEvent("homeiconadmin", "click", function( ) {
  setScreen("HOME");
});
onEvent("Tenantaccount", "click", function( ) {
  setScreen("SignU");
});
onEvent("next1", "click", function() {
  setScreen("loginscreen");
});
onEvent("Landlordaccount", "click", function() {
  setScreen("Landlordaccountuploadimages");
});
onEvent("NextLandlordbutton", "click", function() {
  setScreen("landlordprofile");
});
onEvent("Login", "click", function() {
  setScreen("loginscreen");
});
onEvent("AboutUsButton", "click", function() {
  setScreen("AboutUs");
});
onEvent("Homebutton", "click", function() {
  setScreen("HOME");
});
onEvent("HOMEBUTTONTENANT", "click", function() {
  setScreen("HOME");
});
onEvent("ADMINBUTTONHOME", "click", function() {
  setScreen("ADMINPASSWORDSCREEN");
});
onEvent("home111", "click", function( ) {
  setScreen("HOME");
});



onEvent("landlordloginbutton", "click", function() {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    return;
  }

  // Query Firestore for matching landlord
  db.collection("HomeInformation")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const matchedUser = querySnapshot.docs[0].data();

        setScreen("landlordprofile");
        setText("login_status", "✅ Login successful!");

        var output = "👤 Username: " + matchedUser.username + "\n" +
                     "📍 Location: " + matchedUser.Location + "\n" +
                     "🏠 Description: " + matchedUser.Description + "\n" +
                     "💲 Price: " + matchedUser.Price + "\n" +
                     "📌 Status: " + matchedUser.Status;

        setText("text_area1propertDeatils", output);
      } else {
        setText("login_status", "❌ Incorrect Username or Password.");
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      setText("login_status", "⚠️ Login failed. Try again.");
    });
});





onEvent("tenantloginbutton", "click", function() {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    return;
  }

  db.collection("UserDetails")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const matchedUser = querySnapshot.docs[0].data();

        setScreen("TenantSearchScreen");
        console.log("Login Successful: " + matchedUser.email + " | " + matchedUser.phone);
      } else {
        setText("login_status", "❌ Incorrect Username or Password.");
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      setText("login_status", "⚠️ Login failed. Please try again.");
    });
});



      
onEvent("UpdateStatus", "click", function() {
  var inputs = {
    Location: getText("LocationDropdown").trim(),
    Description: getText("HouseDescriptionInput").trim(),
    Status: getText("StatusInput").trim(),
    Image: getText("LANDLORDIMAGEINPUT").trim(),
    Price: getText("priceinputdropdown").trim(),
    username: getText("NameLandLordInput").trim(),
    Phone: getText("PhoneLandLordInput").trim(),
    Email: getText("EmailLandLordInput").trim(),
    password: getText("LandLordPasswordInput").trim()
  };

  var requiredKeys = ["Location", "Description", "Price", "username", "Phone", "Email", "password"];
  for (var i = 0; i < requiredKeys.length; i++) {
    var key = requiredKeys[i];
    if (inputs[key] === "") {
      setText("UploadStatus2", "❌ Please complete all required fields before submitting.");
      return;
    }
  }

  // Check for conflicts in Firestore
  db.collection("PendingApproval")
    .where("Email", "==", inputs.Email)
    .get()
    .then((emailSnapshot) => {
      if (!emailSnapshot.empty) throw "Email already exists";

      return db.collection("PendingApproval")
        .where("Phone", "==", inputs.Phone)
        .get();
    })
    .then((phoneSnapshot) => {
      if (!phoneSnapshot.empty) throw "Phone number already exists";

      return db.collection("PendingApproval")
        .where("password", "==", inputs.password)
        .get();
    })
    .then((passwordSnapshot) => {
      if (!passwordSnapshot.empty) throw "Password already exists";

      // No conflicts — add to Firestore
      return db.collection("PendingApproval").add(inputs);
    })
    .then(() => {
      setText("UploadStatus2", "✅ Property added successfully! Submit your images with your details via WhatsApp to admin (+260975525434) for verification and approval.");
    })
    .catch((error) => {
      if (typeof error === "string") {
        setText("UploadStatus2", `❌ A property with this ${error.toLowerCase()} already exists.`);
      } else {
        console.error("Error adding property:", error);
        setText("UploadStatus2", "❌ Failed to add property.");
      }
    });
});




onEvent("AdminLandlordordsbutton", "click", function() {
  db.collection("HomeInformation")
    .get()
    .then((querySnapshot) => {
      var outputText = "📋 Landlords Details:\n\n";
      var i = 0;

      querySnapshot.forEach((doc) => {
        var r = doc.data();
        i++;

        outputText += 
          "🔹 Record #" + i + "\n" +
          "🆔 ID: " + doc.id + "\n" +
          "👤 Name: " + (r.username || "No name") + "\n" +
          "📞 Phone: " + (r.Phone || "Not available") + "\n" +
          "📍 Location: " + (r.Location || "No location provided") + "\n" +
          "📝 Description: " + (r.Description || "No description") + "\n\n";
      });

      setText("OutputNames", outputText);
    })
    .catch((error) => {
      console.error("Error fetching landlord details:", error);
      setText("OutputNames", "❌ Failed to load landlord details.");
    });
});





onEvent("AdminTenantsButton", "click", function() {
  db.collection("UserDetails")
    .get()
    .then((querySnapshot) => {
      var outputText = "🏘️ Tenants Details:\n\n";
      var i = 0;

      querySnapshot.forEach((doc) => {
        var r = doc.data();
        i++;

        outputText += 
          "🔸 Record #" + i + "\n" +
          "🆔 ID: " + doc.id + "\n" +
          "👤 Name: " + (r.username || "No name") + "\n" +
          "📞 Phone: " + (r.phone || "Not available") + "\n\n";
      });

      setText("OutputNames", outputText);
    })
    .catch((error) => {
      console.error("Error fetching tenants:", error);
      setText("OutputNames", "❌ Failed to load tenant details.");
    });
});




onEvent("PendingButton", "click", function() {
  db.collection("PendingApproval")
    .get()
    .then((querySnapshot) => {
      var outputText = "⏳ Pending Landlord Submissions:\n\n";
      var i = 0;

      querySnapshot.forEach((doc) => {
        var r = doc.data();
        i++;

        outputText += 
          "📄 Entry #" + i + "\n" +
          "🆔 Record ID: " + doc.id + "\n" +
          "👤 Name: " + (r.username || "No name") + "\n" +
          "📞 Phone: " + (r.Phone || "Not available") + "\n" +
          "📍 Location: " + (r.Location || "No location provided") + "\n" +
          "📝 Description: " + (r.Description || "No description") + "\n\n";
      });

      setText("OutputNames", outputText);
    })
    .catch((error) => {
      console.error("Error fetching pending submissions:", error);
      setText("OutputNames", "❌ Failed to load pending details.");
    });
});







var searchResults = [];
var currentResultIndex = 0;

onEvent("tenantsearchbutton", "click", function() {
  var chosenLocation = getText("dropdownLocationsearchtenantbutton");
  var chosenDescription = getText("dropdownnumberofroomsbutton");
  var chosenStatus = getText("DropdownStatusbutton");
  var chosenPrice = getText("dropdownpricetenant");

  let query = db.collection("HomeInformation");

  if (chosenLocation) query = query.where("Location", "==", chosenLocation);
  if (chosenDescription) query = query.where("Description", "==", chosenDescription);
  if (chosenStatus) query = query.where("Status", "==", chosenStatus);
  if (chosenPrice) query = query.where("Price", "==", chosenPrice);

  query.get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        searchResults = querySnapshot.docs.map(doc => doc.data());
        currentResultIndex = 0;
        displayCurrentResult();
      } else {
        searchResults = [];
        currentResultIndex = 0;
        setText("Descriptionoutput", "❌ No matching records found.");
        setImageURL("imageDisplayTenantSearch", "");
      }
    })
    .catch((error) => {
      console.error("Error fetching properties:", error);
      setText("Descriptionoutput", "⚠️ Failed to load properties.");
    });
});

onEvent("nextResultButton", "click", function() {
  if (searchResults.length > 0) {
    currentResultIndex = (currentResultIndex + 1) % searchResults.length;
    displayCurrentResult();
  }
});

function displayCurrentResult() {
  var record = searchResults[currentResultIndex];
  var outputText = 
    "📋 Result " + (currentResultIndex + 1) + " of " + searchResults.length + "\n\n" +
    "📍 Location: " + record.Location + "\n" +
    "🏠 Description: " + record.Description + "\n" +
    "📌 Status: " + record.Status + "\n" +
    "💰 Price: " + record.Price + "\n" +
    "🆔 Record ID: " + (record.id || "N/A");

  setText("Descriptionoutput", outputText);
  setImageURL("imageDisplayTenantSearch", record.Image || "");
}











function refreshDropdowns() {
  db.collection("HomeInformation")
    .get()
    .then((querySnapshot) => {
      var locationList = new Set();
      var descriptionList = new Set();
      var statusList = new Set();
      var priceList = new Set();

      querySnapshot.forEach((doc) => {
        var r = doc.data();

        if (r.Location) locationList.add(r.Location);
        if (r.Description) descriptionList.add(r.Description);
        if (r.Status) statusList.add(r.Status);
        if (r.Price) priceList.add(r.Price);
      });

      setProperty("dropdownLocationsearchtenantbutton", "options", Array.from(locationList));
      setProperty("dropdownnumberofroomsbutton", "options", Array.from(descriptionList));
      setProperty("DropdownStatusbutton", "options", Array.from(statusList));
      setProperty("dropdownpricetenant", "options", Array.from(priceList));
    })
    .catch((error) => {
      console.error("Error fetching dropdown values:", error);
    });
}

// ✅ Call once at startup
refreshDropdowns();

// ✅ Or call this again after uploading new data:
refreshDropdowns();







onEvent("next1", "click", function() {
  var email = getText("email_input4").trim();
  var phone = getText("phone_input3").trim();
  var password = getText("Password_input5").trim();

  // Validate input fields
  if (email === "" || phone === "" || password === "") {
    setText("signup_status", "⚠️ Please fill in email, phone, and password.");
    return;
  }

  // Check if email or phone already exists in Firestore
  db.collection("UserDetails")
    .where("email", "==", email)
    .get()
    .then((emailSnapshot) => {
      if (!emailSnapshot.empty) throw "Email already exists";

      return db.collection("UserDetails").where("phone", "==", phone).get();
    })
    .then((phoneSnapshot) => {
      if (!phoneSnapshot.empty) throw "Phone number already exists";

      // ✅ Proceed with creating account
      return db.collection("UserDetails").add({
        email: email,
        phone: phone,
        password: password
      });
    })
    .then(() => {
      setText("signup_status", "✅ Account created successfully!");
    })
    .catch((error) => {
      if (typeof error === "string") {
        setText("signup_status", `❌ This ${error.toLowerCase()} is already registered.`);
      } else {
        console.error("Error creating account:", error);
        setText("signup_status", "❌ Error creating account. Try again.");
      }
    });
});





onEvent("tenantsearchbutton", "click", function() {
  var selectedLocation = getText("dropdownLocationsearchtenantbutton");
  var selectedDescription = getText("dropdownnumberofroomsbutton");
  var selectedStatus = getText("DropdownStatusbutton");

  let query = db.collection("HomeInformation");

  if (selectedLocation) query = query.where("Location", "==", selectedLocation);
  if (selectedDescription) query = query.where("Description", "==", selectedDescription);
  if (selectedStatus) query = query.where("Status", "==", selectedStatus);

  query.get()
    .then((querySnapshot) => {
      setText("searchResultCount", "🔍 " + querySnapshot.size + " result(s) found");
    })
    .catch((error) => {
      console.error("Error fetching search results:", error);
      setText("searchResultCount", "⚠️ Failed to load search results.");
    });
});




onEvent("UpdateStatus", "change", function() {
  var newStatus = getText("HomeStatusLandlord");
  var loggedInUsername = getText("username_input").trim().toLowerCase();

  db.collection("HomeInformation")
    .where("username", "==", loggedInUsername)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        return docRef.update({ Status: newStatus });
      } else {
        throw "No matching user found";
      }
    })
    .then(() => {
      setText("statusUpdateLabel", "✅ Status updated to: " + newStatus);
    })
    .catch((error) => {
      if (error === "No matching user found") {
        setText("statusUpdateLabel", "⚠️ No matching user found in database.");
      } else {
        console.error("Error updating status:", error);
        setText("statusUpdateLabel", "❌ Failed to update status.");
      }
    });
});





onEvent("landlordloginbutton", "click", function() {
  var username = getText("username_input").trim().toLowerCase();
  var password = getText("password_input13").trim();

  if (!username || !password) {
    setText("login_status", "❌ Please enter both Username and Password.");
    setImageURL("LandlordProfileimage", "");
    return;
  }

  db.collection("HomeInformation")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const matchedUser = querySnapshot.docs[0].data();

        setText("login_status", "✅ Login successful!");
        setImageURL("LandlordProfileimage", matchedUser.Image || "");
      } else {
        setText("login_status", "❌ Incorrect Username or Password.");
        setImageURL("LandlordProfileimage", "");
      }
    })
    .catch((error) => {
      console.error("Error logging in:", error);
      setText("login_status", "⚠️ Login failed. Try again.");
    });
});




onEvent("updateImageStatusButton", "click", function() {
  var newImage = getText("ImageUrlAdmin").trim();
  var newStatus = getText("StatusUpdateAdmin").trim();

  if (!newImage || !newStatus) {
    setText("Deletelabel", "⚠️ Please enter both image URL and status.");
    return;
  }

  db.collection("PendingApproval")
    .limit(1) // Get the first pending record
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) throw "No pending records found";

      const doc = querySnapshot.docs[0];
      const recordToApprove = doc.data();
      const recordId = doc.id;

      // Add new image and status
      recordToApprove.Image = newImage;
      recordToApprove.Status = newStatus;

      // Move record to HomeInformation
      return db.collection("HomeInformation").doc(recordId).set(recordToApprove)
        .then(() => db.collection("PendingApproval").doc(recordId).delete());
    })
    .then(() => {
      setText("Deletelabel", "✅ Record updated and approved to main database.");
      setText("HiddenRecordId", "");
      setText("OutputNames", "");
    })
    .catch((error) => {
      if (error === "No pending records found") {
        setText("Deletelabel", "❌ No pending records found.");
      } else {
        console.error("Error approving record:", error);
        setText("Deletelabel", "❌ Failed to approve record.");
      }
    });
});




onEvent("Submitadminpasswordbutton", "click", function() {
  var username = getText("AdminUserName").trim().toLowerCase();
  var password = getText("AdminPassword").trim();

  if (!username || !password) {
    setText("AdminLabel", "❌ Please enter both Username and Password.");
    return;
  }

  db.collection("Admin")
    .where("username", "==", username)
    .where("password", "==", password)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const matchedUser = querySnapshot.docs[0].data();

        setScreen("ADMIN"); // Proceed to admin dashboard
        console.log("Login Successful: " + matchedUser.email + " | " + matchedUser.phone);
      } else {
        setText("AdminLabel", "❌ Incorrect Username or Password.");
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      setText("AdminLabel", "⚠️ Login failed. Please try again.");
    });
});




onEvent("DeleteLandlordButton", "click", function() {
  var targetUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

  db.collection("HomeInformation")
    .where("username", "==", targetUsername)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) throw "Username not found";

      let deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
      });

      return Promise.all(deletePromises);
    })
    .then(() => {
      setText("Deletelabel", "✅ Landlord record deleted.");
    })
    .catch((error) => {
      if (error === "Username not found") {
        setText("Deletelabel", "❌ Username not found.");
      } else {
        console.error("Error deleting landlord:", error);
        setText("Deletelabel", "❌ Failed to delete record.");
      }
    });
});




onEvent("DeleteTenantButton", "click", function() {
  var targetUsername = getText("DeleteTenantInput").trim().toLowerCase();

  db.collection("UserDetails")
    .where("username", "==", targetUsername)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) throw "Username not found";

      let deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
      });

      return Promise.all(deletePromises);
    })
    .then(() => {
      setText("Deletelabel", "✅ Tenant record deleted.");
    })
    .catch((error) => {
      if (error === "Username not found") {
        setText("Deletelabel", "❌ Username not found.");
      } else {
        console.error("Error deleting tenant:", error);
        setText("Deletelabel", "❌ Failed to delete record.");
      }
    });
});




onEvent("SearchButtonAdmin", "click", function() {
  var searchUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

  db.collection("HomeInformation")
    .where("username", "==", searchUsername)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();

        var info = 
          "👤 Username: " + (user.username || "") + "\n" +
          "📧 Email: " + (user.Email || "") + "\n" +
          "📞 Phone: " + (user.Phone || "") + "\n" +
          "🏠 Description: " + (user.Description || "") + "\n" +
          "💰 Price: " + (user.Price || "") + "\n" +
          "📌 Status: " + (user.Status || "") + "\n" +
          "📍 Location: " + (user.Location || "") + "\n" +
          "🆔 Record ID: " + querySnapshot.docs[0].id;

        setText("OutputNames", info);
      } else {
        setText("OutputNames", "❌ No user found.");
      }
    })
    .catch((error) => {
      console.error("Error searching landlord:", error);
      setText("OutputNames", "⚠️ Failed to search.");
    });
});




onEvent("FindTenantAdmin", "click", function() {
  var searchUsername = getText("DeleteLandlordInpu").trim().toLowerCase();

  db.collection("UserDetails")
    .where("username", "==", searchUsername)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const user = querySnapshot.docs[0].data();

        var info = "Username: " + user.username + 
                   "\nEmail: " + user.email + 
                   "\nPhone: " + user.phone;

        setText("OutputNames", info);
      } else {
        setText("OutputNames", "❌ No user found.");
      }
    })
    .catch((error) => {
      console.error("Error searching tenant:", error);
      setText("OutputNames", "⚠️ Failed to search.");
    });
});



// When the user clicks "Sign Up"
onEvent("Landlordaccount", "click", function() {
  hideElement("updateImageButton");
  hideElement("LANDLORDIMAGEINPUT");
  // Additional sign-up logic here
});

// When the user clicks "Log In"
onEvent("landlordloginbutton", "click", function() {
  showElement("updateImageButton");
  showElement("LANDLORDIMAGEINPUT");
  // Additional login logic here
});





var lastCount = 0;

onEvent("ADMINBUTTONHOME", "click", function() {
  db.collection("HomeInformation").onSnapshot((querySnapshot) => {
    var newCount = querySnapshot.size;

    if (newCount > lastCount) {
      showElement("notificationLabel");
      setText("notificationLabel", "🔔 New entry added!");

      // Optional: Hide after a few seconds
      setTimeout(function() {
        hideElement("notificationLabel");
      }, 3000);
    }

    lastCount = newCount; // Update count
  });
});



onEvent("UpdateStatusAdmin", "click", function() {
  var newStatus = getText("StatusUpdateAdmin").trim();
  var targetUsername = getText("DeleteLandlordInpu").trim().toLowerCase(); // Input for username

  if (!newStatus || !targetUsername) {
    setText("Deletelabel", "⚠️ Please enter both a username and a new status.");
    return;
  }

  db.collection("HomeInformation")
    .where("username", "==", targetUsername)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        return docRef.update({ Status: newStatus });
      } else {
        throw "No user found with that username";
      }
    })
    .then(() => {
      setText("Deletelabel", "✅ Status updated for user: " + targetUsername);
    })
    .catch((error) => {
      if (error === "No user found with that username") {
        setText("Deletelabel", "❌ No user found with that username.");
      } else {
        console.error("Error updating status:", error);
        setText("Deletelabel", "❌ Failed to update status.");
      }
    });
});

 const firebaseConfig = {
  apiKey: "AIzaSyCA6oxno4zHhbBgOB7Y5EpmR3fMl9Y8SX4",
  authDomain: "live-281b2.firebaseapp.com",
  databaseURL: "https://live-281b2-default-rtdb.firebaseio.com",
  projectId: "live-281b2",
  storageBucket: "live-281b2.firebasestorage.app",
  messagingSenderId: "138809616254",
  appId: "1:138809616254:web:33656c40caa5235a86352f",
  measurementId: "G-DVLKV5EGF3"
};

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();





