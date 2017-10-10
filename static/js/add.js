

function add_buff(name, i) {
    var id_name = "#"+name+"s";
    $(id_name).append('\
    <div class="row">\
        <div class="form-group">\
            <div class="col-sm-1"> \
                <label for="' + name +'" class="control-label">' + Capital(name) + i +':</label>\
            </div>\
            <div class="col-sm-4"> \
                <input type="text" class="form-control" id="' + name + i + '_xpath" name="'+name+i+'_xpath" placeholder="' + Capital(name) + i + ' Xpath" value="" >\
            </div>\
            <div class="col-sm-4"> \
                <input type="text" class="form-control" id="'+name+i+'_default" name="'+name+i+'_default" placeholder="'+Capital(name)+i+' Default" value="" >\
            </div>\
            <button class="btn btn-default xpath_test" type="button" value="on" data-name="'+name+i+'_xpath">测试</button>\
            <button class="btn btn-default btn-modify" type="button" data-name="'+name+i+'" name="btn_'+name+i+'_modify">改动\
                <input class="modify" id="'+name+i+'_modify_checkbox" type="checkbox" >\
            </button>\
            <button class="btn btn-default btn_'+name+'_add" id="btn_next_add" type="button" name="btn_'+name+'_add">\
                <span class="glyphicon glyphicon-plus-sign"></span>\
            </button>\
            <button class="btn btn-default btn_'+name+'_minus" type="button" value="on" id="btn_'+name+'_minus">\
                <span class="glyphicon glyphicon-minus-sign"></span>\
            </button>\
        </div>\
    </div>\
')};

function add_dnn(name, i) {
    $('#'+name+'s').append('\
    <div class="row">\
        <div class="form-group">\
            <div class="col-sm-1">\
                <label for="'+name+i+'" class="control-label">'+Capital(name)+i+':</label>\
            </div>\
            <div class="col-sm-8">\
                <input type="text" class="form-control" id="'+name+i+'_xpath" name="'+name+i+'_xpath" placeholder="'+Capital(name)+i+' Xpath" value="" >\
            </div>\
            <button class="btn btn-default xpath_test" type="button" value="on" data-name="'+name+i+'_xpath">测试</button>\
            <button class="btn btn-default btn-modify" type="button" data-name="'+name+i+'" name="btn_'+name+i+'_modify">改动\
                <input class="modify" id="'+name+i+'_modify_checkbox" type="checkbox" >\
            </button>\
            <button class="btn btn-default" type="submit" value="on" name="btn_'+name+i+'_tpl">跳转</button>\
            <button class="btn btn-default btn_'+name+'_add" type="button" value="on" name="btn_'+name+'_add">\
                <span class="glyphicon glyphicon-plus-sign"></span>\
            </button>\
            <button class="btn btn-default btn_'+name+'_minus" type="button" value="on" name="btn_'+name+'_minus">\
                <span class="glyphicon glyphicon-minus-sign"></span>\
            </button>\
        </div>\
    </div>\
') };


/**
 * initialize function
 */
(function() {
    // detail add & minus
    var detail_i = 2;
    $("#details").on("click", ".btn_detail_add", function(){
        add_dnn("detail", detail_i);
        detail_i++;
    });
    $("#details").on("click", ".btn_detail_minus", function(){
        $(this).parent().parent().remove();
    });

    // next add & minus
    var next_i = 2;
    $("#nexts").on("click", ".btn_next_add", function(){
        add_dnn("next", next_i);
        next_i++;
    });
    $("#nexts").on("click", ".btn_next_minus", function(){
        $(this).parent().parent().remove();
    });

    // buff add & minus
    var buff_i = 2;
    $("#buffs").on("click", ".btn_buff_add", function(){
        add_buff("buff", buff_i);
        buff_i++;
    });
    $("#buffs").on("click", ".btn_buff_minus", function(){
        $(this).parent().parent().remove();
    });

    // test_seed
    $('#btn_seed_text').on("click", function(){
        seed_test();
    })
    // test_xpath
    $('body').on('click', '.xpath_test', function(e){
        var name = $(e.target).data('name');
        var xpath_str = $("#" + name).val();
        if (xpath_str == "") {
            Flash(name + ' is empty!!', "warning");
            return;
        }
        $.ajax({
            type: "POST",
            url: "/test",
            data: {type: "xpath", xpath: xpath_str},
            dataType: "json"
        });
    })

    // modify_modal
    $('body').on('click', '.btn-modify', function(e){
        var button = $(e.target);
        var name = button.attr("data-name");
        console.log(name);
        $('#modify_modal').modal('toggle');
        var modal = $("#modify_modal");
        modal.find(".modal-title").text('Modal to '+name);
        modal.find('.modal-title').data("name", name);
    });

    // ajax save
    $('body').on('change', '.cls-save', function(e){
        var name = $(e.target).attr('name');
        var val = $(e.target).val();
        $.ajax({
            type: "POST",
            url: "/save",
            data: {key: name, value: val}
        });
    })
})();

function seed_test() {
    var pattern = $('#seed_regex').val();
    var seed = $('#seed').val();
    if (pattern == "" || seed == "") {
        Flash("seed or seed_regex is empty!!", "warning");
        return;
    }
    var regex_str = pattern;
    if (seed.match(regex_str)) {
        Flash("test success!!");
    } else {
        Flash("test failed!!", "danger");
    }
}

/*
 * Utils
 *  Capital()
 */
function Capital(s) {
    return s.substr(0, 1).toUpperCase() + s.substr(1);
}
function Flash(msg, type) {
    var _type = "success";
    if (type == "info" || type =="warning" || type == "danger") {
        _type = type;
    }
    $('.alert').remove();
    $('nav').after('<div class="alert alert-'+_type+'" role="alert">'+msg+'</div>')
}
