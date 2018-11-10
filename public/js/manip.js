$(".carousel").carousel({
  interval: 3500
});
$("#signin").bind("click", function() {
  if ($("#sld_sgin").css("display") == "none") {
    $("#sld_sgin").slideDown(450);
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

    $("#sliderprf").animate(
      {
        opacity: 1,
        width: "100%"
      },
      150
    );
    $("#sliderpadw").animate(
      {
        opacity: 1,
        width: "100%"
      },
      150
    );
    $("#sliderout").animate(
      {
        opacity: 1,
        width: "100%"
      },
      450
    );
    $("#sliderprt").animate(
      {
        opacity: 1,
        width: "100%"
      },
      350
    );
    $("#sliderpev").animate(
      {
        opacity: 1,
        width: "100%"
      },
      250
    );
  } else {
    $("#sld_sgin").slideUp(450);
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

    $("#sliderprf").animate(
      {
        opacity: 0,
        width: "0"
      },
      450
    );

    $("#sliderout").animate(
      {
        opacity: 0,
        width: "0"
      },
      150
    );

    $("#sliderpev").animate(
      {
        opacity: 0,
        width: "0"
      },
      350
    );

    $("#sliderprt").animate(
      {
        opacity: 0,
        width: "0"
      },
      250
    );
  }
});
