export function showToastNotification() {
  if (window.location.search.includes("success=true")) {
    const Toast = Swal.mixin({
      toast: true,
      position: "bottom-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "success",
      title: "Message sent successfully!"
    });

    const url = new URL(window.location);
    url.searchParams.delete("success");
    window.history.replaceState({}, document.title, url.toString());
  }
}
