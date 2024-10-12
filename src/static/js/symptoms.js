const selectedSympList = [];

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
    $(".symptoms-available").append(availablePill({ name: pill.textContent }));
    pill.remove();
    selectedSympList.pop();
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

$(document).ready(() => {
    clearSelectionArea();

    $("#search").on('click', () => {
        
    })
})