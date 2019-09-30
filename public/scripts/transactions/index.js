$('#today').click(function(){
    $('#today').addClass('active');
    $('#alldays').removeClass('active');
    $('#thisperiod').removeClass('active');
    $('#allperiods').removeClass('active');
    $('.nottoday').fadeOut();
    $('.dateheader').fadeOut();
});

$('#alldays').click(function(){
    $('#today').removeClass('active');
    $('#alldays').addClass('active');
    $('#thisperiod').removeClass('active');
    $('#allperiods').removeClass('active');
    $('.dateheader').fadeIn();
    $('.nottoday').fadeIn();
});

$('#thisperiod').click(function(){
    $('#today').removeClass('active');
    $('#alldays').removeClass('active');
    $('#thisperiod').addClass('active');
    $('#allperiods').removeClass('active');
    $('.nottoday').fadeIn();
});

$('#allperiods').click(function(){
    $('#today').removeClass('active');
    $('#alldays').removeClass('active');
    $('#thisperiod').removeClass('active');
    $('#allperiods').addClass('active');
    $('.nottoday').fadeIn();
});

$('#dateselector').click(function(){
    alert('Connected');
})