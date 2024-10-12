const host = window.location.hostname;
const port = window.location.port;
const protocol = window.location.protocol;

console.log(protocol, host, port);

let selectedSympList = [];

function selectionPillIcon() {
    return `<div class="selected-heading bg-green-500 rounded-xl px-3 py-2 w-fit text-sm m-1"><i
                    class="bi bi-capsule-pill text-white"></i></div>`;
}

function availablePill({ name }) {
    return `<div class="availale-pill bg-gray-100 rounded-xl px-3 py-2 h-fit m-1 w-fit text-sm cursor-pointer" onclick="onAvailablePillClick(this)">
                ${name}
            </div>`;
}

function onSelectionPillClick(pill) {
    const name = pill.textContent.trim();
    $(".symptoms-available").append(availablePill({ name: name }));
    pill.remove();
    selectedSympList = selectedSympList.filter(e => e != name);
}

function onAvailablePillClick(pill) {
    const name = pill.textContent.trim();
    $(".selection-box").append(selectionPill({ name }));
    pill.remove();
    selectedSympList.push(name);
}

function selectionPill({ name }) {
    return `<div class="bg-gray-100 rounded-xl px-3 py-2 h-fit m-1 w-fit text-sm cursor-pointer" onClick="onSelectionPillClick(this)">
                ${name} <i class="bi bi-x"></i></div>`;
}

function clearSelectionArea() {
    $(".selection-box").empty();
    $(".selection-box").append(selectionPillIcon());
}

function createResultContainer({ name, brand, symptoms, purpose }) {
    return `<div class="result flex items-center justify-between border-2 border-gray-100 rounded-xl p-2 my-1">
                <div class="info flex flex-col">
                    <h3 class="text-lg font-bold">${name}</h3>
                    <p class="text-sm text-gray-400">${brand}</p>
                    <p class="text-sm"><b>Use for:</b> ${symptoms.join(", ")}</p>
                    <div class="flex flex-col mt-2">
                        ${purpose.map(p => `<p class="text-sm"><i class="bi bi-shield-check"></i> ${p}</p>`).join("")}
                    </div>
                </div>
            </div>`;
}


$('.loader-container').hide();

$(document).ready(() => {
    clearSelectionArea();

    $("#search").on('click', () => {
        if (selectedSympList.length > 0) {
            $('.loader-container').fadeIn(200);
            fetch(`${protocol}//${host}:${port}/api/symptom`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    symptoms: selectedSympList
                })
            })
                .then(resp => resp.json())
                .then(data => {
                    if (data.status === 200) {
                        $(".results").empty();
                        const respData = data.data;
                        for (let i = 0; i < respData.length; i++) {
                            $(".results").append(createResultContainer({
                                name: respData[i].name,
                                brand: respData[i].brand,
                                symptoms: respData[i].symptoms,
                                purpose: respData[i].purpose
                            }));
                        }
                    } else {
                        alert(data.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                    alert("Something went wrong");
                })
                .finally(() => {
                    $('.loader-container').fadeOut(200);
                });
        }
    })
})