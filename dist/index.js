"use strict";
const addDocumentButton = document.querySelector(".btn");
const arrow = document.querySelector(".arrow");
const appDiv = document.querySelector(".app");
const profileButton = document.querySelector(".profileButton");
const leftPane = document.querySelector(".leftPane");
const logo = document.querySelector(".logo");
const user = document.querySelector(".user");
const icons = document.querySelector(".icons");
const bottom = document.querySelector(".bottom");
let hamburger = true;
// Ensure DOM elements exist before adding event listeners
if (addDocumentButton && arrow && appDiv && profileButton && leftPane && logo && user && icons && bottom) {
    window.addEventListener("load", displayStoredDocuments);
    addDocumentButton.addEventListener("click", createModal);
    arrow.addEventListener("click", handleArrow);
    profileButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const profileModel = document.querySelector(".profileModel");
        if (profileModel) {
            profileModel.classList.remove("invisible");
        }
    });
    document.addEventListener("click", (event) => {
        const profileModel = document.querySelector(".profileModel");
        const profileButton = document.querySelector(".profileButton");
        if (profileModel && !profileModel.contains(event.target)) {
            profileModel.classList.add("invisible");
        }
    });
}
function handleArrow() {
    if (!arrow || !leftPane || !logo || !user || !icons || !bottom)
        return;
    if (hamburger) {
        arrow.classList.add("rotate-180");
        leftPane.className =
            "w-[91px] h-screen p-[31px] flex flex-col justify-between transition-all duration-300 ease-in-out leftPane";
        logo.classList.add("hidden");
        user.classList.add("hidden");
        icons.classList.add("hidden");
        bottom.classList.add("hidden");
        hamburger = false;
    }
    else {
        arrow.classList.remove("rotate-180");
        leftPane.className =
            "w-[371px] h-screen p-[31px] flex flex-col justify-between transition-all duration-300 ease-in-out leftPane";
        logo.classList.remove("hidden");
        user.classList.remove("hidden");
        icons.classList.remove("hidden");
        bottom.classList.remove("hidden");
        hamburger = true;
    }
}
function createModal() {
    if (!appDiv)
        return;
    const modalHTML = `
    <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 w-[400px] rounded-lg shadow-xl">
        <h2 class="text-xl font-bold mb-4">Add New Document</h2>
        <form id="documentForm" class="flex flex-col gap-4">
          <div>
            <label for="fileName" class="block font-medium">Document Name</label>
            <input type="text" id="fileName" required class="w-full p-2 border rounded-md">
          </div>
          <div>
            <label for="lastModified" class="block font-medium">Last Modified</label>
            <input type="date" id="lastModified" required class="w-full p-2 border rounded-md">
          </div>
          <div>
            <label for="status" class="block font-medium">Status</label>
            <select id="status" required class="w-full p-2 border rounded-md">
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
          <div class="flex justify-end gap-2 mt-4">
            <button type="button" id="cancelButton" class="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-[#002230] text-white rounded-md">Add</button>
          </div>
        </form>
      </div>
    </div>
  `;
    appDiv.innerHTML = modalHTML;
    const cancelButton = document.getElementById("cancelButton");
    const documentForm = document.getElementById("documentForm");
    if (cancelButton && documentForm) {
        cancelButton.addEventListener("click", closeModal);
        documentForm.addEventListener("submit", addDocumentRow);
    }
}
function closeModal() {
    const modal = document.getElementById("modal");
    if (modal) {
        modal.remove();
    }
}
function addDocumentRow(event) {
    event.preventDefault();
    const fileNameInput = document.getElementById("fileName");
    const lastModifiedInput = document.getElementById("lastModified");
    const statusSelect = document.getElementById("status");
    if (!fileNameInput || !lastModifiedInput || !statusSelect)
        return;
    const fileName = fileNameInput.value;
    const lastModified = lastModifiedInput.value;
    const status = statusSelect.value;
    const documentData = { fileName, lastModified, status };
    saveToLocalStorage(documentData);
    appendDocumentRow(documentData);
    closeModal();
}
function saveToLocalStorage(documentData) {
    let documents = JSON.parse(localStorage.getItem("documents") || "[]");
    documents.push(documentData);
    localStorage.setItem("documents", JSON.stringify(documents));
}
function displayStoredDocuments() {
    const documents = JSON.parse(localStorage.getItem("documents") || "[]");
    documents.forEach((doc) => appendDocumentRow(doc));
}
function appendDocumentRow({ fileName, lastModified, status }) {
    const tableBody = document.querySelector("table tbody");
    if (!tableBody)
        return;
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td class="p-[10px]">
      <div class="flex items-center pl-[18px]">
        <input type="checkbox">
        <span class="ml-[29px]">${fileName}</span>
      </div>
    </td>
    <td class="p-[10px] text-black font-semibold">${status}</td>
    <td class="p-[10px]">${lastModified}</td>
    <td class="p-[10px] text-right">
      <button class="text-gray px-[20px] py-[4px] rounded-[5px] cursor-pointer border border-gray-300 p-4">Download PDF</button>
    </td>
    <td class="w-[25px]"></td>
  `;
    tableBody.appendChild(newRow);
}
