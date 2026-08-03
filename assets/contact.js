/* Contact form → mailto (contact.html only). */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  var note = document.getElementById("cf-note");
  if (!form || !note) return;
  var TO = "mpiccolo@fas.harvard.edu";
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var subject = form.subject.value.trim();
    var message = form.message.value.trim();
    if (!name || !email || !message) {
      note.textContent = "Please add your name, email, and a message.";
      note.classList.add("err");
      return;
    }
    var subjectLine = subject || "Website message from " + name;
    var body = message + "\n\n— " + name + "\n" + email;
    var href = "mailto:" + TO + "?subject=" + encodeURIComponent(subjectLine) + "&body=" + encodeURIComponent(body);
    note.classList.remove("err");
    note.textContent = "Opening your email app…";
    window.location.href = href;
  });
})();
