$(".owl_theme_custom_carousel").owlCarousel({
    autoWidth: true,
    loop: true
  });
  $(document).ready(function () {
    $(".owl_theme_custom_carousel .item").click(function () {
      $(".owl_theme_custom_carousel .item").not($(this)).removeClass("active");
      $(this).toggleClass("active");
    });
});

console.log("Trending!")