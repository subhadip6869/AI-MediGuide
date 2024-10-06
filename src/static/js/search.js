// const findBtn = document.querySelector("#search");
// const inputField = document.querySelector("#textfield");
// const btnText = document.querySelector(".btn-text");
// const btnLoader = document.querySelector(".loader");
const host = window.location.hostname;
const port = window.location.port;
const protocol = window.location.protocol;

console.log(protocol, host, port);

function createResultContainer({ name, manufacturer, prescriptionRequired, imageUrl }) {
	return `<div
				class="results-container flex items-center justify-between border-2 border-gray-100 rounded-xl p-2 my-1">
				<div class="infos flex flex-col">
					<p class="text-sm text-gray-400">${prescriptionRequired ? "Rx" : "OTC"}</p>
					<p class="text-lg font-bold">${name}</p>
					<p class="text-sm text-gray-400">Manufacturer: ${manufacturer}</p>
					<button class="bg-gray-100 rounded-xl px-3 py-2 w-fit text-sm mt-2">View Details</button>
				</div>
				<div class="image">
					<img src="${imageUrl ? imageUrl : '/images/default.jpg'}" class="w-40" alt="">
				</div>
			</div>`;
}

$(document).ready(() => {
	$('.loader-container').hide();
	$("#search").click(async () => {
		let inputText = $("#textfield").val();

		if (inputText) {
			console.log(`Searching with: ${inputText}`);
			$('.loader-container').show(500);

			try {
				let count = 10;
				while (count > 0) {
					console.log(`Attempt left: ${count}`);

					let res = await fetch(`${protocol}//${host}:${port}/api/info`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							medicines: inputText,
						}),
					});

					let responseData = await res.json();
					if (responseData.status === 200) {
						let data = await responseData.data;
						console.log(typeof data);

						$(".results").empty();

						for (let i = 0; i < data.length; i++) {
							$(".results").append(createResultContainer({
								name: data[i].NAME,
								manufacturer: data[i].MANUFACTURER,
								prescriptionRequired: data[i].PRESCRIPTION_REQUIRED,
								imageUrl: ""
							}));
						}
						break;
					}
					count--;
				}

				if (count === 0) {
					alert("No results found");
				}
			} catch (e) {
				console.log(e.message);
			} finally {
				$('.loader-container').hide(500);
			}
		}
	});
});

// function createElementWithText(tag, text) {
// 	const element = document.createElement(tag);
// 	element.innerHTML = text;
// 	return element;
// }

// findBtn.addEventListener("click", async () => {
// 	let counter = 0;
// 	if (!inputField.value) return;
// 	const errorMsgElem = document.querySelector("#medicineOutputModal p");
// 	errorMsgElem.style.display = "none";
// 	btnLoader.style.display = "block";
// 	btnText.style.display = "none";
// 	while (true) {
// 		try {
// 			let res = await fetch(`${protocol}//${host}:${port}/api/info`, {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify({
// 					medicines: inputField.value,
// 				}),
// 			});

// 			let responseData = await res.json();

// 			if (responseData.status == 200) {
// 				const modalContainer = document.getElementById(
// 					"medicineOutputModal"
// 				);

// 				const table = document.querySelector(
// 					"#medicineOutputModal table"
// 				);
// 				table.replaceChildren();

// 				// adding table headers
// 				let headerRow = document.createElement("tr");
// 				headerRow.classList.add("bg-slate-300");

// 				// adding heading labels
// 				for (
// 					let i = 0;
// 					i < Object.keys(responseData.data[0]).length - 1;
// 					i++
// 				) {
// 					let th = createElementWithText(
// 						"th",
// 						Object.keys(responseData.data[0])[i].replace("_", " ")
// 					);
// 					th.classList.add("p-2.5", "border", "border-slate-700");
// 					headerRow.appendChild(th);
// 				}

// 				table.appendChild(headerRow);
// 				// end of adding table headers

// 				let data = responseData.data;

// 				// adding output data
// 				for (let i = 0; i < data.length; i++) {
// 					if (data[i]["INVALID_MESSAGE"]) {
// 						continue;
// 					}

// 					const trow = document.createElement("tr");

// 					let keys = Object.keys(data[i]);
// 					for (let j = 0; j < keys.length - 1; j++) {
// 						if (keys[j] === "PRESCRIPTION_REQUIRED") {
// 							let td = createElementWithText(
// 								"td",
// 								data[i][keys[j]] ? "Rx" : "OTC"
// 							);
// 							td.classList.add(
// 								"p-2.5",
// 								"border",
// 								"border-slate-700"
// 							);
// 							trow.appendChild(td);
// 						} else {
// 							let td = createElementWithText(
// 								"td",
// 								data[i][keys[j]]
// 							);
// 							td.classList.add(
// 								"p-2.5",
// 								"border",
// 								"border-slate-700"
// 							);
// 							trow.appendChild(td);
// 						}
// 					}

// 					table.appendChild(trow);
// 				}

// 				let modal = new bootstrap.Modal(modalContainer);
// 				modal.show();
// 				break;
// 			} else {
// 				console.log(responseData);
// 				if (++counter == 10) {
// 					document
// 						.querySelector("#medicineOutputModal table")
// 						.replaceChildren();
// 					errorMsgElem.style.display = "block";
// 					let modal = new bootstrap.Modal(
// 						document.getElementById("medicineOutputModal")
// 					);
// 					modal.show();
// 					break;
// 				}
// 				// alert(responseData.message);
// 			}
// 		} catch (e) {
// 			console.log(e);
// 		} finally {
// 			btnText.style.display = "block";
// 			btnLoader.style.display = "none";
// 		}
// 	}
// });
