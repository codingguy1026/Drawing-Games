const sidebar = document.querySelector('.sidebar');
const mouse = document.querySelector('.mouse');

mouse.addEventListener('mouseover', function() {
  sidebar.classList.add('visible');
});

mouse.addEventListener('mouseout', function() {
  sidebar.classList.remove('visible');
});
