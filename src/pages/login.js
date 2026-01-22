import { loginUser } from "../auth";

export default function Login() {
  setTimeout(() => {
    document.getElementById("loginBtn").onclick = () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      if (loginUser(email, password)) {
        window.location.hash = "/home";
      } else {
        alert("Invalid credentials");
      }
    };
  });

  return `
 <div
        class="h-dvh w-dvw flex justify-center items-center bg-linear-to-r from-[#00d9de] to-[#e84bbf]"
      >
        <div
          class="h-auto w-100 flex flex-col items-center bg-amber-100 rounded-md shadow-xl shadow-indigo-500/30"
        >
          <h1 class="text-3xl font-bold py-4">Login</h1>
          <form
            onsubmit="return validateForm()"
            class="flex flex-col pt-2 w-[70%]"
          >
            <label class="pt-3 text-sm font-medium text-gray-600">Username</label>
            <div
              class="flex h-8 pb-1.5 mt-0.5 items-center justify-start border-b-2 border-gray-500 hover:shadow-md"
            >
              <i class="fa-regular fa-user text-gray-400 px-2 fa-sm"></i>
              <input type="text" id="email" class="h-6 w-full ml-2 outline-none" />
            </div>
            <label class="pt-3 text-sm font-medium text-gray-600">Password</label>
            <div
              class="flex h-8 pb-1.5 mt-0.5 items-center justify-start border-b-2 border-gray-500 hover:shadow-md"
            >
              <i class="fa-solid fa-lock text-gray-400 px-2 fa-sm"></i>
              <input type="password" id="password" class="h-6 w-full ml-2 outline-none" />
            </div>
            <p class="text-right text-xs text-gray-500 underline">
              Forgot password?
            </p>
            <input
              id="loginBtn"
              type="submit"
              value="LOGIN"
              class="h-8 my-4 font-semibold rounded-xl bg-linear-to-r from-[#00d9de] to-[#e84bbf] text-amber-100 cursor-pointer hover:brightness-105"
            />
          </form>
          
          <div class="flex flex-col mt-2 mb-4">
           <p class="text-sm p-2">Don't have an Acount?
            <a class="font-semibold" href="#/register">Register</a>
           </p>
          </div>
        </div>
      </div> `;
}
