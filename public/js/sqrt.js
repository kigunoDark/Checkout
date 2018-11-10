$(".carousel").carousel({
  interval: 3500
});
$("#signin").bind("click", function() {
  if ($("#sliderlogin").css("opacity") == 0) {
    $("#sld_sgin").slideDown(350);
    $("#sliderlogin").animate(
      {
        opacity: 1,
        width: "100%"
      },
      150
    );
    $("#sliderpass").animate(
      {
        opacity: 1,
        width: "100%"
      },
      250
    );
    $("#sliderin").animate(
      {
        opacity: 1,
        width: "100%"
      },
      350
    );
  } else {
    $("#sld_sgin").slideUp(350);
    $("#sliderlogin").animate(
      {
        opacity: 0,
        width: "0"
      },
      350
    );
    $("#sliderpass").animate(
      {
        opacity: 0,
        width: "0"
      },
      250
    );
    $("#sliderin").animate(
      {
        opacity: 0,
        width: "0"
      },
      150
    );
  }
});
