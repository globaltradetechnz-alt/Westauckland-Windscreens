// Mobile nav toggle
document.addEventListener('DOMContentLoaded',function(){
  var t=document.querySelector('.nav-toggle'),l=document.querySelector('.nav-links');
  if(t&&l){t.addEventListener('click',function(){l.classList.toggle('open');});
    l.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){l.classList.remove('open');});});}
});
