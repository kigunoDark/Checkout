$(".carousel").carousel({
  interval: 3500
});
$("#signin").bind("click", function() {
  if ($("#sliderlogin").css("opacity") == 0) {
    $("#sld_sgin").slideDown(750);
    $("#sliderlogin").animate(
      {
        opacity: 1,
        width: "100%"
      },
      550
    );
    $("#sliderpass").animate(
      {
        opacity: 1,
        width: "100%"
      },
      750
    );
    $("#sliderin").animate(
      {
        opacity: 1,
        width: "100%"
      },
      950
    );
  } else {
    $("#sld_sgin").slideUp(750);
    $("#sliderlogin").animate(
      {
        opacity: 0,
        width: "0"
      },
      1100
    );
    $("#sliderpass").animate(
      {
        opacity: 0,
        width: "0"
      },
      750
    );
    $("#sliderin").animate(
      {
        opacity: 0,
        width: "0"
      },
      550
    );
  }
});
