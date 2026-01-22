import {
  computePosition,
  flip,
  shift,
  offset,
  autoUpdate,
} from "@floating-ui/dom";

const TODO_KEY = "zendo_todos";

export default function Home() {
  // setTimeout(() => {
  //   document.getElementById("logout").onclick = () => {
  //     logoutUser();
  //     window.location.hash = "/login";
  //   };
  // });

  function loadTodos() {
    const data = localStorage.getItem(TODO_KEY);
    return data
      ? JSON.parse(data)
      : [
          { id: 1, day: "Today", Tasks: ["Start using Zendo"] },
          { id: 2, day: "Later", Tasks: ["learning"] },
          { id: 3, day: "This Week", Tasks: ["listening"] },
        ];
  }
  let todos = loadTodos();

  function saveTodos() {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  }

  function renderTodos() {
    const listContainer = document.getElementById("List-container");
    listContainer.innerHTML = "";

    todos.forEach((todo) => {
      const list = document.createElement("li");
      list.className =
        "Draggrand block self-start h-[100%] w-71 px-1.5 leading-5 rounded-xl";
      list.dataset.id = todo.id;

      list.innerHTML = `
      <div class="relative flex flex-col bg-[#101204] rounded-xl pb-1">
      
        <header class="flex items-center justify-between h-10 px-3 my-1">
          <h2 class="text-[#bfc1c4] text-sm font-bold">${todo.day}</h2>
          <button type="button" class="button h-8 w-8 hover:bg-gray-300/10 rounded-lg cursor-pointer">
            <i class="fa-solid fa-ellipsis text-[#bfc1c4]"></i>
          </button>
          <div class="tooltip" role="tooltip">List Actions</div>
        </header>
          
        <ol class="dragparent flex flex-col min-h-2 px-2 text-[14px] leading-5 font-medium">
          ${todo.Tasks.map(
            (task) => `
            <li draggable="true"
              class="Task group h-9 text-[#a9abaf] bg-[#242528] mb-1.5 rounded-lg cursor-pointer">
              <div class="relative h-9 mb-1.5 px-3 flex items-center w-64 rounded-lg group-hover:border-2 group-hover:border-[#ffffff]">
                <div class="flex items-start h-6 w-58">
                  <span class="status-box group-hover:inline-block hidden">
                    <button class="task-status cursor-pointer">        
                      <i class="fa-regular fa-circle mr-2"></i>
                    </button>
                  </span>
                  <span>${task}</span>
                </div>
                <div class="absolute h-auto right-0.5 top-0.5 w-auto z-10 hidden group-hover:inline-block">
                  <button
                    type="button"
                    class="inline-flex items-center justify-center h-6.5 w-6.5 p-1.5 mx-0.5 z-10 rounded-full cursor-pointer hover:bg-gray-300/10"
                  >
                    <i class="fa-solid fa-box-archive"></i>
                  </button>
                  <button
                    type="button"
                    class="inline-flex items-center justify-center h-6.5 w-6.5 p-1.5 mx-0.5 z-10 rounded-full overflow-visible cursor-pointer hover:bg-gray-300/10"
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                </div>
              </div>
            </li>
            `
          ).join("")}
          
          <li class="addition-card hidden text-[14px] leading-5 font-medium">
            <textarea
              placeholder="Enter a Title"
              class="card-name block h-14 w-full px-3 py-2 bg-[#242528] text-[#a9abaf] rounded-lg"></textarea>
            <div class="flex mt-2">
              <button class="add-task-btn bg-[#669df1] px-3 py-1.5 text-black rounded-sm hover:bg-blue-300 cursor-pointer">
                Add Card
              </button>
              <button class="ext-carding ml-2 text-white cursor-pointer">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </li>
        </ol>
  
        <footer class="Add-card flex items-center justify-between h-10 px-3">
          <button class="addition-cardbtn text-[#a4a6a9] hover:bg-gray-300/10 rounded-md px-2 py-1">
            <i class="fa-solid fa-plus mr-1"></i> Add a card
          </button>
          <button class="button h-8 w-8 hover:bg-gray-300/10 rounded-lg">
            <i class="fa-regular fa-hard-drive text-[#a4a6a9]"></i>
          </button>
            <div class="tooltip" role="tooltip"> Create from template... </div>
        </footer>
      </div>
      `;

      listContainer.appendChild(list);
    });
    dragNdrop();
  }

  document.addEventListener("DOMContentLoaded", renderTodos);


  // --------- list button Events
  function ListBtn() {
    document
      .getElementById("AddListBtn")
      .addEventListener("click", function () {
        document.getElementById("Add-list").style.display = "none";
        document.getElementById("Listing").style.display = "block";
        console.log("clicked");
      });

    document
      .getElementById("ext-listing")
      .addEventListener("click", function () {
        document.getElementById("Add-list").style.display = "block";
        document.getElementById("Listing").style.display = "";
        console.log("clicked Again");
      });

    document.getElementById("additionbtn").addEventListener("click", () => {
      let Listname = document.getElementById("list-name");

      if (!Listname.value) return;

      let newTodo = {
        id: todos.length + 1,
        day: Listname.value,
        Tasks: [],
      };
      todos.push(newTodo);
      document.getElementById("Add-list").style.display = "block";
      document.getElementById("Listing").style.display = "";
      saveTodos();
      Listname.value = "";
      renderTodos();
      console.log(todos);
    });
  }

  // --------- task status

  function taskSts() {
    document.querySelectorAll(".task-status").forEach((btn) => {
      const statusBox = btn.closest(".group").querySelector(".status-box");

      btn.addEventListener("click", () => {
        const isHidden = statusBox.classList.contains("hidden");

        if (isHidden) {
          statusBox.classList.remove("hidden", "group-hover:inline-block");
          statusBox.classList.add("inline-block");
          btn.innerHTML = `<i class="fa-solid fa-circle-check text-[#b3df72] mr-2"></i>`;
        } else {
          statusBox.classList.remove("inline-block");
          statusBox.classList.add("hidden", "group-hover:inline-block");
          btn.innerHTML = `<i class="fa-regular fa-circle mr-2"></i>`;
        }
      });
    });
  }

  // --------- Add Task

  function addNewTask(listElement) {
    const cardName = listElement.querySelector(".card-name");
    const value = cardName.value.trim();
    if (!value) return;

    const id = Number(listElement.dataset.id);
    const todo = todos.find((t) => t.id === id);

    todo.Tasks.push(value);
    saveTodos();
    cardName.value = "";
    renderTodos();
  }

  function cardForm() {
    document.addEventListener("click", (e) => {
      // --------- Show card form

      if (e.target.closest(".addition-cardbtn")) {
        const list = e.target.closest(".Draggrand");
        list.querySelector(".addition-card").classList.remove("hidden");
        list.querySelector(".Add-card").classList.add("hidden");
      }

      // --------- Hide card form

      if (e.target.closest(".ext-carding")) {
        const list = e.target.closest(".Draggrand");
        list.querySelector(".addition-card").classList.add("hidden");
        list.querySelector(".Add-card").classList.remove("hidden");
      }

      // --------- Add Task

      if (e.target.closest(".add-task-btn")) {
        const list = e.target.closest(".Draggrand");
        addNewTask(list);
      }
    });
  }

  // --------- DND logic
  function dragNdrop() {
    let dragTask = null;
    const previewBox = document.createElement("div");
    previewBox.className= "hidden h-9 w-64 mb-1.5 bg-gray-800 rounded-lg";

    document.querySelectorAll(".Task").forEach((task) => {
      task.addEventListener("dragstart", () => (dragTask = task));
      task.addEventListener("dragend", () => (dragTask = null));
    });

    document.querySelectorAll(".dragparent").forEach((dragParent) => {
      dragParent.addEventListener("dragover", (e) => {
        e.preventDefault();
        dragParent.appendChild(previewBox);
      });

      dragParent.addEventListener("dragenter", () =>
        previewBox.classList.remove("hidden")
      );

      dragParent.addEventListener("dragleave", () =>
        previewBox.classList.add("hidden")
      );

      dragParent.addEventListener("drop", () => {
        previewBox.classList.add("hidden");
        dragParent.appendChild(dragTask);
      });
    });
  }

  // --------- tooltip logic
  function tooltips() {
    document.querySelectorAll(".button").forEach((button) => {
      const tooltip = button.nextElementSibling;

      button.addEventListener("mouseenter", () => {
        tooltip.style.display = "block";
        computePosition(button, tooltip, {
          middleware: [offset(8), flip(), shift({ padding: 5 })],
        }).then(({ x, y }) => {
          Object.assign(tooltip.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      });

      button.addEventListener("mouseleave", () => {
        tooltip.style.display = "";
      });

      document.body.append(tooltip);
    });
  }

  // --------- Dropdown logic
  function dropDowns() {
    document.querySelectorAll(".button").forEach((button) => {
      const dropdown = button.parentElement.querySelector(".dropdown");

      button.addEventListener("click", () => {
        dropdown.classList.add("block");
        dropdown.classList.remove("hidden");
        computePosition(button, dropdown, {
          middleware: [offset(8), flip(), shift({ padding: 5 })],
        }).then(({ x, y }) => {
          Object.assign(dropdown.style, {
            left: `${x}px`,
            top: `${y}px`,
          });
        });
      });

      window.addEventListener("mousedown", (e) => {
        if (!e.target.contains(dropdown)) {
          var dropdowns = document.getElementsByClassName("dropdown");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("block")) {
              openDropdown.classList.remove("block");
              openDropdown.classList.add("hidden");
            }
          }
        }
      });

      document.body.append(dropdown);
    });
  }

  function initilizeAll() {
    dropDowns();
    tooltips();
    dragNdrop();
    renderTodos();
    ListBtn();
    taskSts();
    cardForm();
  }

  setTimeout(initilizeAll);

  return `
    <div class="relative overflow-hidden bg-[#1f1f21] z-1 h-dvh"><div class="relative flex flex-col h-dvh">
        <nav class="flex justify-between p-2 h-12">
          <div class="flex w-29.5">
            <div>
              <button
                type="button"
                class="button w-8 h-8 rounded-sm hover:bg-gray-300/10 hover:cursor-pointer"
              >
                <span><i class="fa-solid fa-bars text-white fa-sm"></i></span>
              </button>
              <div class="tooltip" role="tooltip">More from Atlassian</div>
              <div
                class="dropdown hidden shrink h-[300.713px] min-w-0 overflow-y-auto w-85.75 leading-5"
              >
                <div class="block h-[290.713px] min-h-[calc(100% - 60px)]">
                  <section
                    class="block h-29.5 w-full -mt-px pt-2 pb-1.5 border-t overflow-hidden"
                  >
                    <div class="block h-24 w-81.75 mb-2 mx-2">
                      <ul class="h-full w-full">
                        <li>
                          <div
                            class="relative flex items-center h-12 min-h-10 p-2 w-full rounded-sm cursor-pointer hover:bg-gray-300/10"
                          >
                            <a
                              class="flex items-center flex-row grow h-8 justify-between w-77.75"
                            >
                              <span
                                class="flex items-center justify-center rounded-lg bg-[#dddee1] h-8 w-8"
                                ><i
                                  class="fa-solid fa-house fa-lg text-[#101214]"
                                ></i></span
                              ><span
                                class="flex flex-col justify-center w-67.75 h-5 text-[14px] font-medium"
                                >Home</span
                              >
                            </a>
                          </div>
                        </li>
                        <li class="h-12 w-full">
                          <div
                            class="relative flex items-center h-12 min-h-10 p-2 w-full rounded-sm cursor-pointer hover:bg-gray-300/10"
                          >
                            <a
                              class="flex items-center flex-row grow h-8 justify-between w-77.75"
                              ><span
                                class="flex items-center justify-center rounded-lg h-8 w-8"
                                ><img
                                  src="/Logo.svg"
                                  alt="logo"
                                  class="size-7.5 rounded-lg" /></span
                              ><span
                                class="flex flex-col justify-center w-67.75 h-5 text-[14px] font-medium"
                                >Zendo</span
                              ></a
                            >
                          </div>
                        </li>
                      </ul>
                    </div>
                  </section>
                  <section
                    class="block h-30 w-full -mt-px pt-2 pb-1.5 border-t overflow-hidden"
                  >
                    <div class="block h-35 mx-2 mb-2 w-81.75">
                      <h2 class="block h-4 w-full">
                        <div
                          class="block h-4 my-1.5 ml-2 w-79.75 text-[12px] font-medium"
                        >
                          Recommended for your team
                        </div>
                      </h2>
                      <div
                        class="relative flex items-center h-12 min-h-10 mt-2 p-2 w-full rounded-sm cursor-pointer hover:bg-gray-300/10"
                      >
                        <a
                          class="flex items-center flex-row grow h-8 justify-between w-77.75"
                        >
                          <span
                            class="flex items-center justify-center rounded-lg bg-[#dddee1] h-8 w-8"
                            ><i
                              class="fa-solid fa-warehouse fa-lg text-[#101214]"
                            ></i></span
                          ><span
                            class="flex flex-col justify-center w-67.75 h-5 text-[14px] font-medium"
                            >More Atlassian apps</span
                          >
                        </a>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            <div
              class="flex w-25 h-8 px-2 rounded-sm hover:bg-gray-300/10 hover:cursor-pointer"
            >
              <img src="/Logo.svg" alt="logo" class="size-6 my-1 rounded-md" />
              <h1 class="text-white font-sm p-1">Zendo</h1>
            </div>
          </div>
          <div class="flex justify-center w-309.5">
            <div
              class="relative flex w-195 h-8 bg-[#242528] border border-[#7e8188] rounded-md"
            >
              <span
                class="absolute left-2 top-2 flex items-center justify-center h-4 w-4"
                ><i
                  class="fa-solid fa-magnifying-glass fa-xs text-[#7e8188]"
                ></i
              ></span>

              <input
                placeholder="Search"
                class="w-195 pl-7.5 pr-3 text-[#7e8188] text-bold focus:outline-none hover:bg-gray-300/3"
              />
            </div>
            <div>
              <button
                type="button"
                class="flex items-center justify-center bg-[#669df1] w-17 h-8 text-center rounded-sm mx-2 hover:bg-blue-300 hover:cursor-pointer"
              >
                <p class="px-3 text-[14px]">Create</p>
              </button>
            </div>
          </div>
          <div class="flex justify-between w-35">
            <div>
              <button
                type="button"
                class="button flex items-center justify-center h-8 w-8 rounded-sm hover:bg-gray-300/10 hover:cursor-pointer"
              >
                <i class="fa-solid fa-bullhorn fa-sm text-[#a9abaf] mx-2"></i>
              </button>
              <div class="tooltip" role="tooltip">
                Share your thoughts on Zendo
              </div>
              <div class="dropdown hidden w-76 h-23 p-3">
                <ul class="my-0.5">
                  <li>
                    <button
                      class="w-full h-8 py-1.5 px-3 font-semibold text-left cursor-pointer rounded-sm hover:bg-gray-300/10"
                    >
                      Share Your thoughts on Zendo
                    </button>
                  </li>
                  <li>
                    <span
                      class="flex justify-between w-full h-8 py-1.5 px-3 font-semibold cursor-pointer rounded-sm hover:bg-gray-300/10"
                    >
                      <span>Ask the community</span>
                      <span
                        ><i
                          class="fa-solid fa-arrow-up-right-from-square"
                        ></i></span
                    ></span>
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <button
                type="button"
                class="button flex items-center justify-center h-8 w-8 rounded-sm hover:bg-gray-300/10 hover:cursor-pointer"
              >
                <i class="fa-regular fa-bell text-[#a9abaf] mx-2"></i>
              </button>
              <div class="tooltip" role="tooltip">Notifications</div>
              <div class="dropdown hidden h-[385.5px] w-108">
                <div class="h-[349.8px] w-full">
                  <div
                    class="flex justify-between pb-5 mx-3 mt-6 border-b border-b-gray-500/40"
                  >
                    <h2 class="ml-1.5 mt-1 text-xl font-bold leading-6">
                      Notifications
                    </h2>
                    <div class="flex">
                      <div class="flex">
                        <label class="h-4 m-1.5 text-xs"
                          >Only show unread</label
                        >
                        <div class="h-7 w-10.5">
                          <label
                            class="relative inline-flex items-center cursor-pointer p-0.5 m-0.5 mt-1.25 h-5 w-9"
                          >
                            <input
                              type="checkbox"
                              class="sr-only peer"
                              checked
                            />
                            <span
                              class="w-8 h-4 rounded-full bg-gray-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.75 after:start-1 after:bg-black after:rounded-full after:h-3.5 after:w-3.5 after:transition-all border-gray-600 peer-checked:bg-[#93c648]"
                            ></span>
                          </label>
                        </div>
                      </div>
                      <button
                        class="w-6 h-6 m-0.5 rounded-md cursor-pointer hover:bg-gray-300/10"
                      >
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                      </button>
                    </div>
                  </div>
                  <div class="w-full h-0 px-3 py-2"></div>
                  <div class="relative h-71.25 w-full mb-3">
                    <div
                      class="absolute top-4 flex flex-col items-center justify-center h-57.25 w-full my-3 px-2"
                    >
                      <img
                        class="mb-8"
                        src="https://trello.com/assets/ee2660df9335718b1a80.svg"
                        alt="taco"
                      />
                      <h3 class="mb-6 text-xl font-bold">
                        No unread notifications
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                type="button"
                class="button flex items-center justify-center h-8 w-8 rounded-sm hover:bg-gray-300/10 hover:cursor-pointer"
              >
                <i
                  class="fa-regular fa-circle-question text-[#a9abaf] mx-2"
                ></i>
              </button>
              <div class="tooltip" role="tooltip">Information</div>
            </div>
            <div>
              <button
                type="button"
                class="button flex items-center justify-center h-8 w-8 rounded-sm hover:bg-gray-300/10 hover:cursor-pointer"
              >
                <div
                  class="flex items-center justify-center text-[11px] text-white rounded-full bg-[#5243aa] size-6"
                >
                  MH
                </div>
              </button>
              <div class="tooltip" role="tooltip">Account</div>
            </div>
          </div>
        </nav>
        <div class="relative grow overflow-y-auto h-[95%]">
          <div>
            <div class="flex relative h-full pt-1 px-4 pb-8">
              <div
                class="relative flex flex-col pb-8 w-100 bg-[#162f55] border border-[#46474b] rounded-2xl"
              >
                <div class="bg-[#12233d] h-14 rounded-t-2xl">
                  <h2
                    class="flex justify-between h-8 my-3 ml-4 mr-2 items-center"
                  >
                    <div class="text-white text-[16px]">
                      <i class="fa-solid fa-inbox text-white mx-2"></i>Inbox
                    </div>
                    <div class="w-28 h-8 justify-end">
                      <ul class="group flex w-full h-full justify-between">
                        <li
                          class="items-center w-8 h-8 hidden rounded-sm group-hover:flex hover:bg-gray-300/10"
                        >
                          <div>
                            <button
                              type="button"
                              class="button flex items-center justify-center overflow-visible w-8 h-8 p-1 hover:cursor-pointer"
                            >
                              <i class="fa-solid fa-bullhorn text-white"></i>
                            </button>
                            <div class="tooltip" role="tooltip">
                              Share your thoughts on Inbox
                            </div>
                            <div class="dropdown hidden w-76 h-23 p-3">
                              <ul class="my-0.5">
                                <li>
                                  <button
                                    class="w-full h-8 py-1.5 px-3 font-semibold text-left cursor-pointer rounded-sm hover:bg-gray-300/10"
                                  >
                                    Share Your thoughts on Inbox
                                  </button>
                                </li>
                                <li>
                                  <span
                                    class="flex justify-between w-full h-8 py-1.5 px-3 font-semibold cursor-pointer rounded-sm hover:bg-gray-300/10"
                                  >
                                    <span>Ask the community</span>
                                    <span
                                      ><i
                                        class="fa-solid fa-arrow-up-right-from-square"
                                      ></i></span
                                  ></span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                        <li
                          class="items-center w-8 h-8 hidden rounded-sm group-hover:flex hover:bg-gray-300/10"
                        >
                          <div>
                            <button
                              type="button"
                              class="flex items-center justify-center overflow-visible w-8 h-8 p-1 hover:cursor-pointer"
                            >
                              <i class="fa-solid fa-bars text-white"></i>
                            </button>
                          </div>
                        </li>
                        <li
                          class="items-center w-8 h-8 hidden rounded-sm group-hover:flex hover:bg-gray-300/10"
                        >
                          <div>
                            <button
                              type="button"
                              class="flex items-center justify-center overflow-visible w-8 h-8 p-1 hover:cursor-pointer"
                            >
                              <i class="fa-solid fa-ellipsis text-white"></i>
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </h2>
                </div>
                <div class="px-2 mt-3 mb-1.5">
                  <button
                    type="button"
                    class="group bg-[#242528] w-96 h-9 rounded-md py-2 px-3 text-[14px] shadow-sm shadow-[#0f1a2a] cursor-pointer text-left hover:bg-gray-600"
                  >
                    <span class="text-[#96999e] group-hover:text-white"
                      >Add a card</span
                    >
                  </button>
                </div>
                <ol
                  class="flex flex-col h-full px-2 pb-16 pt-1.5 mx-1 overflow-x-hidden overflow-y-auto z-1"
                >
                  <div
                    class="flex flex-col h-full min-h-44 py-8 px-4 justify-between items-center overflow-clip"
                  >
                    <h5 class="text-white text-center mb-2 leading-5 font-bold">
                      Consolidate your to-dos
                    </h5>
                    <p
                      class="pb-10 text-xs mb-2 text-center text-white leading-5"
                    >
                      Email it, say it, forward it — however it comes, get it
                      into Zendo fast.
                    </p>
                    <div class="flex w-102 h-full">
                      <div
                        class="relative left-27.5 flex justify-center w-24 h-full"
                      >
                        <div class="flex justify-center items-center w-24 h-24">
                          <button
                            type="button"
                            class="bg-[#1f1f21] border border-[#4688ec] rounded-full size-16 hover:border-2 hover:border-[#8fb8f6]"
                          >
                            <i
                              class="fa-regular fa-envelope fa-xl text-[#4688ec]"
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div class="relative top-24 left-2 flex w-18 h-full z-2">
                        <div class="flex justify-center items-center w-18 h-18">
                          <button
                            type="button"
                            class="bg-[#1f1f21] border border-[#29b67c] rounded-full size-12 px-1.5 py-px"
                          >
                            <i class="fa-brands fa-slack text-[#29b67c]"></i>
                          </button>
                        </div>
                      </div>
                      <div class="relative top-16 flex w-18 h-full z-1">
                        <div class="flex justify-center items-center w-18 h-18">
                          <button
                            type="button"
                            class="bg-[#1f1f21] border border-[#c89a04] rounded-full size-12 px-1.5 py-px"
                          >
                            <i
                              class="fa-solid fa-mobile-screen fa-xl text-[#eed12b]"
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div class="relative right-6 top-27 flex w-18 h-full z-2">
                        <div class="flex justify-center items-center w-18 h-18">
                          <button
                            type="button"
                            class="bg-[#1f1f21] border border-[#b45fe6] rounded-full size-12 px-1.5 py-px"
                          >
                            <i
                              class="fa-solid fa-people-group text-[#b45fe6]"
                            ></i>
                          </button>
                        </div>
                      </div>
                      <div
                        class="relative top-3 right-26 flex justify-center w-24 h-full"
                      >
                        <div class="flex justify-center items-center w-24 h-24">
                          <button
                            type="button"
                            class="bg-[#1f1f21] border border-[#7f5f01] rounded-full size-16"
                          >
                            <i
                              class="fa-brands fa-chrome fa-xl text-[#7f5f01]"
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-center px-4 pb-3">
                    <span
                      ><i class="fa-solid fa-lock fa-sm text-white"></i
                    ></span>
                    <p
                      class="text-white text-[12px] ml-2 font-semibold pt-1 leading-5"
                    >
                      Inbox is only visible to you
                    </p>
                  </div>
                </ol>
              </div>
              <div class="w-3 h-164 bg-[#1f1f21]">
                <div class="relative w-3 h-164"></div>
              </div>
              <div
                class="relative flex flex-col w-full bg-linear-to-br from-[#56438a] to-[#9e5083] rounded-2xl"
              >
                <div
                  class="bg-linear-to-br from-[#3e3269] to-[#573767] h-14 rounded-t-2xl"
                >
                  <div
                    class="container flex justify-between p-3 h-14 items-center"
                  >
                    <span class="flex justify-start h-8 w-174 items-center"
                      ><div
                        class="flex mr-1 h-8 relative items-center cursor-pointer rounded-sm hover:bg-gray-300/30"
                      >
                        <h1 class="text-white font-bold leading-8 px-3 mb-1">
                          My Zendo Board
                        </h1>
                      </div>
                      <div class="w-13.5">
                        <button
                          type="button"
                          class="button flex items-center justify-center p-1.5 cursor-pointer rounded-sm hover:bg-gray-300/30"
                        >
                          <i
                            class="fa-solid fa-chart-simple fa-flip-vertical text-white mr-1.5"
                          ></i
                          ><i class="fa-solid fa-angle-down text-white"></i>
                        </button>
                        <div class="tooltip" role="tooltip">Views</div>
                      </div></span
                    ><span class="flex h-8 items-center justify-between w-86"
                      ><div>
                        <button
                          type="button"
                          class="flex items-center justify-center rounded-full w-7.5 h-7.5 mr-1 bg-[#5243aa] text-xs text-white cursor-pointer"
                        >
                          MH
                        </button>
                      </div>
                      <div class="flex justify-between items-center w-17 h-8">
                        <div>
                          <button
                            type="button"
                            class="button flex items-center justify-center px-2 py-1.5 w-8 h-8 cursor-pointer rounded-sm hover:bg-gray-300/30"
                          >
                            <i class="fa-solid fa-rocket text-white fa-sm"></i>
                          </button>
                          <div class="tooltip" role="tooltip">Power-Ups</div>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="button flex items-center justify-center px-2 py-1.5 w-8 h-8 cursor-pointer rounded-sm hover:bg-gray-300/30"
                          >
                            <i class="fa-solid fa-bolt text-white fa-sm"></i>
                          </button>
                          <div class="tooltip" role="tooltip">Automations</div>
                        </div>
                      </div>
                      <span class="flex items-center h-8 w-8"
                        ><button
                          type="button"
                          class="button flex items-center justify-center h-8 w-8 p-1.5 cursor-pointer rounded-sm hover:bg-gray-300/30"
                        >
                          <i class="fa-solid fa-bars text-white"></i>
                        </button>
                        <div class="tooltip" role="tooltip">
                          Filter Cards
                        </div></span
                      >
                      <div class="flex justify-between items-center h-8 w-17">
                        <div>
                          <button
                            type="button"
                            class="button flex items-center justify-center px-2 py-1.5 w-8 h-8 cursor-pointer rounded-sm hover:bg-gray-300/30"
                          >
                            <i class="fa-regular fa-star text-white fa-sm"></i>
                          </button>
                          <div class="tooltip" role="tooltip">
                            Click to Star or unstar this board. Starred boards
                            show up at the top of your boards list.
                          </div>
                        </div>
                        <div>
                          <button
                            type="button"
                            class="button flex items-center justify-center px-2 py-1.5 w-8 h-8 cursor-pointer rounded-sm hover:bg-gray-300/30"
                          >
                            <i
                              class="fa-solid fa-user-group fa-sm text-white"
                            ></i>
                          </button>
                          <div class="tooltip" role="tooltip">
                            Change visibility
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        title="Share board"
                        class="flex items-center h-8 mx-1 pr-3 pl-2 bg-[#dcdfe4] opacity-95 rounded-sm hover:opacity-150"
                      >
                        <div class="p-1">
                          <i
                            class="fa-solid fa-user-plus fa-sm text-[#172b4d]"
                          ></i>
                        </div>
                        <span class="text-[#172b4d] text-[14px] ml-1"
                          >Share</span
                        ></button
                      ><button
                        type="button"
                        class="flex justify-center items-center h-8 w-8 p-1.5 cursor-pointer rounded-sm hover:bg-gray-300/30"
                      >
                        <i class="fa-solid fa-ellipsis text-white"></i></button
                    ></span>
                  </div>
                </div>
                <div class="relative mt-3 h-full w-full">
                  <ol
                    class="absolute -top-0.5 flex flex-row bottom-0.5 overflow-x-auto overflow-y-hidden pt-0.5 pb-3 px-1.5 mb-8 w-full h-[95%] scrollbar-thin scrollbar-thumb-[(255, 255, 255, 0.4)]"
                  >
                    <div id="List-container" class="flex flex-row">
                      <!-- task list -->
                    </div>
                    <!-- ov -->
                    <div
                      class="relative flex self-start h-full w-71 px-1.5 leading-5"
                    >
                      <div id="Add-list" class="self-start grow h-11 px-1.5">
                        <button
                          type="button"
                          id="AddListBtn"
                          class="inline-flex items-center justify-start p-3 h-11 w-68 bg-gray-400/45 rounded-xl overflow-visible text-[14px] text-[#f9f8fa] font-semibold cursor-pointer hover:bg-gray-400/35"
                        >
                          <span
                            class="flex items-center justify-center h-4 w-4 mr-2"
                            ><i class="fa-solid fa-plus"></i></span
                          >Add another list
                        </button>
                      </div>
                      <div
                        id="Listing"
                        class="self-start list-item h-22 w-71 px-1.5"
                      >
                        <div class="block h-full w-68 rounded-xl bg-[#101204]">
                          <form class="flex flex-col w-full p-2">
                            <textarea
                              name="Enter list name..."
                              id="list-name"
                              placeholder="Enter list name..."
                              class="h-8 max-h-64 min-h-5 overflow-hidden py-1 px-3 w-64 text-[14px] font-semibold text-[#96999e] leading-5 rounded-sm border border-[#7e8188] bg-gray-500/25 hover:bg-gray-500/35"
                            ></textarea>
                            <div
                              class="flex items-center justify-start h-8 w-64 mt-2"
                            >
                              <button
                                id="additionbtn"
                                type="button"
                                class="flex items-center justify-center h-8 w-[74.225px] py-1.5 px-3 overflow-visible rounded-sm bg-[#669df1] text-[14px] font-medium hover:bg-blue-300 hover:cursor-pointer"
                              >
                                Add list
                              </button>
                              <button
                                id="ext-listing"
                                type="button"
                                class="flex items-center justify-center ml-1 h-8 w-8 p-1.5 text-white rounded-sm cursor-pointer hover:bg-gray-300/10"
                              >
                                <span
                                  class="flex items-center justify-center h-5 w-5"
                                  ><i class="fa-solid fa-xmark"></i
                                ></span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </ol>
                </div>
              </div>
            </div>
            <nav
              class="fixed flex items-end bottom-4 justify-center w-full h-0 z-1"
            >
              <div
                class="flex h-11 p-1.5 w-[442.45px] bg-[#18191a] border border-[#323235] rounded-xl text-[14px] leading-5"
              >
                <div class="h-8">
                  <button
                    type="button"
                    class="relative flex items-center justify-center h-8 px-3 py-1.5 rounded-xl"
                  >
                    <span class="mr-2"
                      ><i
                        class="fa-solid fa-inbox text-[#c3c4c8] fa-sm"
                      ></i></span
                    ><span></span
                    ><span class="text-[#c3c4c8] text-sm font-semibold"
                      >Inbox</span
                    >
                  </button>
                </div>
                <div class="h-8">
                  <button
                    type="button"
                    class="relative flex items-center justify-center h-8 px-3 py-1.5 rounded-xl"
                  >
                    <span class="mr-2"
                      ><i
                        class="fa-regular fa-calendar text-[#c3c4c8] fa-sm"
                      ></i></span
                    ><span></span
                    ><span class="text-[#c3c4c8] text-sm font-semibold"
                      >Planner</span
                    >
                  </button>
                </div>
                <div class="h-8">
                  <button
                    type="button"
                    class="relative flex items-center justify-center h-8 px-3 py-1.5 rounded-xl"
                  >
                    <span class="mr-2"
                      ><i
                        class="fa-regular fa-clipboard text-[#c3c4c8] fa-sm"
                      ></i></span
                    ><span></span
                    ><span class="text-[#c3c4c8] text-sm font-semibold"
                      >Board</span
                    >
                  </button>
                </div>
                <div class="h-8"><button></button></div>
              </div>
            </nav>
          </div>
        </div>
      </div></div>
  `;
}
