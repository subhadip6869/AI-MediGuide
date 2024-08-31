const findBtn = document.querySelector("#find");
const inputField = document.querySelector("#textfield");
const host = window.location.hostname;
const port = window.location.port;

findBtn.addEventListener("click", async () => {
	let counter = 0;
	if (!inputField.value) return;
    const errorMsgElem = document.querySelector("#medicineOutputModal p");
    errorMsgElem.style.display = "none";
	while (true) {
		try {
			let res = await fetch(`http://${host}:${port}/api/info`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					medicines: inputField.value,
				}),
			});

			let responseData = await res.json();

			if (responseData.status == 200) {
				const modalContainer = document.getElementById(
					"medicineOutputModal"
				);

				const table = document.querySelector(
					"#medicineOutputModal table"
				);
				table.replaceChildren();

				// adding table headers
				let headerRow = document.createElement("tr");
				let th = document.createElement("th");
				th.innerHTML = "NAME";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "MANUFACTURER";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "INGREDIENT";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "USAGE";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "SIDE EFFECT";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "PRECAUTION";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "CATEGORY";
				headerRow.appendChild(th);
				th = document.createElement("th");
				th.innerHTML = "Rx/OTC";
				headerRow.appendChild(th);

				table.appendChild(headerRow);

				let data = responseData.data;

				// adding output data
				for (let i = 0; i < data.length; i++) {
					if (data[i]["INVALID_MESSAGE"]) {
						continue;
					}

					const trow = document.createElement("tr");

					let td = document.createElement("td");
					td.innerHTML = data[i]["NAME"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["MANUFACTURER"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["INGREDIENT"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["USAGE"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["SIDE_EFFECT"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["PRECAUTION"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["CATEGORY"];
					trow.appendChild(td);

					td = document.createElement("td");
					td.innerHTML = data[i]["PRESCRIPTION_REQUIRED"]
						? "Rx"
						: "OTC";
					trow.appendChild(td);

					table.appendChild(trow);
				}

				let modal = new bootstrap.Modal(modalContainer);
				modal.show();
				break;
			} else {
				console.log(responseData);
				if (++counter == 10) {
					document
						.querySelector("#medicineOutputModal table")
						.replaceChildren();
                        errorMsgElem.style.display = "block";
					let modal = new bootstrap.Modal(
						document.getElementById("medicineOutputModal")
					);
					modal.show();
					break;
				}
				// alert(responseData.message);
			}
		} catch (e) {
			console.log(e);
		}
	}
});
