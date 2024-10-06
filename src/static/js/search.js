const host = window.location.hostname;
const port = window.location.port;
const protocol = window.location.protocol;

console.log(protocol, host, port);

// Links container
function createLinksContainer({ url, title }) {
	return `<a href="${url}" target="_blank" class="text-blue-500 hover:text-blue-700 hover:underline">${title ? title : url}</a>`
}

// details view inside the modal
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

				${createDetailsSection({ title: "Is this medicine prescription or over the counter?", description: prescriptionRequired === true ? "Rx" : prescriptionRequired === false ? "OTC" : "Not available" })}

				<div class="section my-2">
					<p class="font-bold">Where I can order?</p>
					<div class="flex flex-wrap gap-2">
					${productUrls.length > 0
			? productUrls.map(url => createLinksContainer({ url: url, title: new URL(url).hostname })).join('')
			: "Not available"}
					</div>
				</div>
			</div>`;
}

// runs when "View Details" button is clicked, it passes the necessary data and generates the details view for the model
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
			productUrls: productUrls.split(","),
			imageUrl,
			invalidMessage
		})
	});
}

// medicine overview cards after search is complete
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
					<p class="text-sm text-gray-400">Manufacturer: ${manufacturer ? manufacturer : "N/A"}</p>
					<button onClick="onDetailsClick({
						name: '${name.replace(/'/g, "\\'")}', 
						manufacturer: '${manufacturer.replace(/'/g, "\\'")}', 
						productForm: '${productForm.replace(/'/g, "\\'")}', 
						ingredients: '${ingredients.join(", ").replace(/'/g, "\\'")}', 
						usage: '${usage.replace(/'/g, "\\'")}', 
						sideEffect: '${sideEffect.replace(/'/g, "\\'")}', 
						precaution: '${precaution.replace(/'/g, "\\'")}', 
						category: '${category.replace(/'/g, "\\'")}', 
						prescriptionRequired: ${prescriptionRequired},
						productUrls: '${productUrls.join(",")}',
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

// each section for the details view inside the modal
function createDetailsSection({ title, description }) {
	return `<div class="section my-2">
				<p class="font-bold">${title}</p>
				<p>${description ? description : "Not available"}</p>
			</div>`;
}

// helps to show the modal by taking a simple message
function showModal({ message }) {
	$("#myModal .modal-details").empty();
	$("#myModal .content").text(message);
	$("#myModal").fadeIn(300);
}

// shows the modal by taking and whole html element
function showModalDetails({ element }) {
	$("#myModal .content").text("");
	$("#myModal .modal-details").empty();
	$("#myModal .modal-details").append(element);
	$("#myModal").fadeIn(300);
}

// hides & clears modal data
function hideModal() {
	$("#myModal .content").text("");
	$("#myModal .modal-details").empty();
	$("#myModal").fadeOut(300);
}


// hides modal when page is loading for first time
$("#myModal").hide(0);

// close modal on clicking on cross button inside modal
$(".close").click(() => {
	hideModal();
});

// inserting upto 5 recent search keywords into local storage
function storeRecentSearches({ keyword }) {
	let recentSearches = localStorage.getItem("recentSearches");
	if (recentSearches) {
		recentSearches = JSON.parse(recentSearches);
		if (recentSearches.length >= 5) {
			recentSearches.pop();
		}
	} else {
		recentSearches = [];
	}
	recentSearches.unshift(keyword);
	recentSearches = [...new Set(recentSearches)];
	localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

// fetching stored recent searches
function getRecentSearches() {
	let recentSearches = localStorage.getItem("recentSearches");
	if (recentSearches) {
		recentSearches = JSON.parse(recentSearches);
	} else {
		recentSearches = [];
	}
	return recentSearches;
}

// recent search keyword pills
function createRecentSearchPill({ keyword }) {
	return `<button class="bg-gray-100 rounded-xl px-3 py-2 w-fit text-sm mt-2"
					onClick="onRecentPillClick({ keyword: '${keyword}' })">
				${keyword}
			</button>`;
}
function onRecentPillClick({ keyword }) {
	$("#textfield").val(keyword);
	// $("#search").click();
}

$(document).ready(() => {

	$('.loader-container').hide();
	for (let key of getRecentSearches()) {
		$(".recent-keywords").append(createRecentSearchPill({ keyword: key }));
	}

	$("#search").click(async () => {
		let inputText = $("#textfield").val();

		if (inputText) {
			// refreshing the recent searches
			storeRecentSearches({ keyword: inputText });
			$(".recent-keywords").empty();
			for (let key of getRecentSearches()) {
				$(".recent-keywords").append(createRecentSearchPill({ keyword: key }));
			}

			console.log(`Searching with: ${inputText}`);
			$('.landing-text').hide();
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
