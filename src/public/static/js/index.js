(function () {
  const html = document.getElementsByTagName('html')[0];
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      html.classList.add('dark');
    }
  } catch (e) {}
})();
