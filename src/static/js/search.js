// const findBtn = document.querySelector("#search");
// const inputField = document.querySelector("#textfield");
// const btnText = document.querySelector(".btn-text");
// const btnLoader = document.querySelector(".loader");
const host = window.location.hostname;
const port = window.location.port;
const protocol = window.location.protocol;

console.log(protocol, host, port);

function onDetailsClick({ name,
	manufacturer,
	productForm,
	ingredients,
	usage,
	sideEffect,
	precaution,
	category,
	prescriptionRequired,
	productUrls,
	imageUrl,
	invalidMessage }) {
	showModalDetails({
		element: createDetailsResponse({
			name,
			manufacturer,
			productForm,
			ingredients,
			usage,
			sideEffect,
			precaution,
			category,
			prescriptionRequired,
			productUrls,
			imageUrl,
			invalidMessage
		})
	});
}

function createResultContainer({ name,
	manufacturer,
	productForm,
	ingredients,
	usage,
	sideEffect,
	precaution,
	category,
	prescriptionRequired,
	productUrls,
	imageUrl,
	invalidMessage }) {
	return `<div
				class="results-container flex items-center justify-between border-2 border-gray-100 rounded-xl p-2 my-1">
				<div class="infos flex flex-col">
					<p class="text-sm text-gray-400">${prescriptionRequired ? "Rx" : "OTC"}</p>
					<p class="text-lg font-bold">${name}</p>
					<p class="text-sm text-gray-400">Manufacturer: ${manufacturer}</p>
					<button onClick="onDetailsClick({
						name: '${name}', 
						manufacturer: '${manufacturer}', 
						productForm: '${productForm}', 
						ingredients: '${ingredients.join(", ")}', 
						usage: '${usage}', 
						sideEffect: '${sideEffect}', 
						precaution: '${precaution}', 
						category: '${category}', 
						prescriptionRequired: ${prescriptionRequired}
					})" 
					id="view-details" 
					class="bg-gray-100 rounded-xl px-3 py-2 w-fit text-sm mt-2"
				>
					View Details
				</button>
				</div>
				<div class="image">
					<img src="${imageUrl ? imageUrl : '/images/default.jpg'}" class="w-40" alt="">
				</div>
			</div>`;
}

function createDetailsSection({ title, description }) {
	return `<div class="section my-2">
				<p class="font-bold">${title}</p>
				<p>${description}</p>
			</div>`;
}

function createDetailsResponse({ name, manufacturer, productForm, ingredients, usage, sideEffect, precaution, category, prescriptionRequired, productUrls, imageUrl, invalidMessage }) {
	return `<div class="flex flex-col">
				<h1 class="font-bold text-3xl">${name}</h1>

                ${createDetailsSection({ title: "Manufacturer", description: manufacturer })}

                ${createDetailsSection({ title: "Product Form", description: productForm })}

				${createDetailsSection({ title: "Ingredients", description: ingredients })}

				${createDetailsSection({ title: "Usage", description: usage })}

				${createDetailsSection({ title: "Side Effects", description: sideEffect })}
				
				${createDetailsSection({ title: "Precaution", description: precaution })}

				${createDetailsSection({ title: "Category", description: category })}

				${createDetailsSection({ title: "Is this medicine prescription or over the counter?", description: prescriptionRequired ? "Rx" : "OTC" })}
			</div>`;
}

function showModal({ message }) {
	$("#myModal .modal-details").empty();
	$("#myModal .content").text(message);
	$("#myModal").fadeIn(300);
}

function showModalDetails({ element }) {
	$("#myModal .content").text("");
	$("#myModal .modal-details").empty();
	$("#myModal .modal-details").append(element);
	$("#myModal").fadeIn(300);
}

function hideModal() {
	$("#myModal .content").text("");
	$("#myModal .modal-details").empty();
	$("#myModal").fadeOut(300);
}

$("#myModal").hide(0);

$(".close").click(() => {
	hideModal();
});

$(document).ready(() => {
	$('.loader-container').hide();
	$("#search").click(async () => {
		let inputText = $("#textfield").val();

		if (inputText) {
			console.log(`Searching with: ${inputText}`);
			$('.loader-container').fadeIn(200);

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
								productForm: data[i].PRODUCT_FORM,
								ingredients: data[i].INGREDIENT,
								usage: data[i].USAGE,
								sideEffect: data[i].SIDE_EFFECT,
								precaution: data[i].PRECAUTION,
								category: data[i].CATEGORY,
								prescriptionRequired: data[i].PRESCRIPTION_REQUIRED,
								productUrls: data[i].PRODUCT_URL,
								imageUrl: "",
								invalidMessage: data[i].INVALID_MESSAGE,
							}));
						}
						break;
					}
					count--;
				}

				if (count === 0) {
					showModal({ message: "No results found" });
				}
			} catch (e) {
				showModal({ message: "Something went wrong" });
			} finally {
				$('.loader-container').fadeOut(200);
			}
		}
	});
});
