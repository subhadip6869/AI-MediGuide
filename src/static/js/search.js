const findBtn = document.querySelector("#find");
const inputField = document.querySelector("#textfield");
const btnText = document.querySelector(".btn-text");
const btnLoader = document.querySelector(".loader");
const host = window.location.hostname;
const port = window.location.port;

function createElementWithText(tag, text) {
	const element = document.createElement(tag);
	element.innerHTML = text;
	return element;
}

findBtn.addEventListener("click", async () => {
	let counter = 0;
	if (!inputField.value) return;
	const errorMsgElem = document.querySelector("#medicineOutputModal p");
	errorMsgElem.style.display = "none";
	btnLoader.style.display = "block";
	btnText.style.display = "none";
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
				headerRow.classList.add("bg-slate-300");

				// adding heading labels
				for (
					let i = 0;
					i < Object.keys(responseData.data[0]).length - 1;
					i++
				) {
					let th = createElementWithText(
						"th",
						Object.keys(responseData.data[0])[i].replace("_", " ")
					);
					th.classList.add("p-2.5", "border", "border-slate-700");
					headerRow.appendChild(th);
				}

				table.appendChild(headerRow);
				// end of adding table headers

				let data = responseData.data;

				// adding output data
				for (let i = 0; i < data.length; i++) {
					if (data[i]["INVALID_MESSAGE"]) {
						continue;
					}

					const trow = document.createElement("tr");

					let keys = Object.keys(data[i]);
					for (let j = 0; j < keys.length - 1; j++) {
						if (keys[j] === "PRESCRIPTION_REQUIRED") {
							let td = createElementWithText(
								"td",
								data[i][keys[j]] ? "Rx" : "OTC"
							);
							td.classList.add(
								"p-2.5",
								"border",
								"border-slate-700"
							);
							trow.appendChild(td);
						} else {
							let td = createElementWithText(
								"td",
								data[i][keys[j]]
							);
							td.classList.add(
								"p-2.5",
								"border",
								"border-slate-700"
							);
							trow.appendChild(td);
						}
					}

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
		} finally {
			btnText.style.display = "block";
			btnLoader.style.display = "none";
		}
	}
});
