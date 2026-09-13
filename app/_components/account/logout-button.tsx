"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href =
          "/auth/logout";
      }}
      className="rounded-md border px-4 py-2"
    >
      Sign out
    </button>
  );
}