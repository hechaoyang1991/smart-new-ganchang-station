/* spec对象 */
function spec(id, spec1, spec2, price,price1, stock)
{
    this.id    = id;
    this.spec1 = spec1;
    this.spec2 = spec2;
    this.price = price;
    this.price1 = price1;
    this.stock = stock;
}

/* goodsspec对象 */
function goodsspec(specs, specQty, defSpec)
{
    this.specs = specs;
    this.specQty = specQty;
    this.defSpec = defSpec;
    this.spec1 = null;
    this.spec2 = null;
    if (this.specQty >= 1)
    {
        for(var i = 0; i < this.specs.length; i++)
        {
            if (this.specs[i].id == this.defSpec)
            {
                this.spec1 = this.specs[i].spec1;
                if (this.specQty >= 2)
                {
                    this.spec2 = this.specs[i].spec2;
                }
                break;
            }
        }
    }

    // 取得某字段的不重复值，如果有spec1，以此为条件
    this.getDistinctValues = function(field, spec1)
    {
        var values = new Array();
        for (var i = 0; i < this.specs.length; i++)
        {
            var value = this.specs[i][field];
            if (spec1 != '' && spec1 != this.specs[i].spec1) continue;
            if ($.inArray(value, values) < 0)
            {
                values.push(value);
            }
        }
        return (values);
    }

    // 取得选中的spec
    this.getSpec = function()
    {
        for (var i = 0; i < this.specs.length; i++)
        {
            if (this.specQty >= 1 && this.specs[i].spec1 != this.spec1) continue;
            if (this.specQty >= 2 && this.specs[i].spec2 != this.spec2) continue;

            return this.specs[i];
        }
        return null;
    }

    // 初始化
    this.init = function()
    {
        if (this.specQty >= 1)
        {
            var spec1Values = this.getDistinctValues('spec1', '');
            for (var i = 0; i < spec1Values.length; i++)
            {
                if (spec1Values[i] == this.spec1)
                {
                    $(".specifications:eq(0)").append("<a href='javascript:;' class='active' onclick='selectSpec(1, this)'>" + spec1Values[i] + "</a>");
                }
                else
                {
                    $(".specifications:eq(0)").append("<a href='javascript:;' onclick='selectSpec(1, this)'>" + spec1Values[i] + "</a>");
                }
            }
        }
        if (this.specQty >= 2)
        {
            var spec2Values = this.getDistinctValues('spec2', this.spec1);
            for (var i = 0; i < spec2Values.length; i++)
            {
                if (spec2Values[i] == this.spec2)
                {
                	  $(".specifications:eq(1)").append("<a href='javascript:;' class='active' onclick='selectSpec(2, this)'>" + spec2Values[i] + "</a>");
                }
                else
                {
                	  $(".specifications:eq(1)").append("<a href='javascript:;' onclick='selectSpec(2, this)'>" + spec2Values[i] + "</a>");
                }
            }
        }
        var spec = this.getSpec();
        $("[ectype='current_spec']").html(spec.spec1 + ' ' + spec.spec2);
    }
}

/* 选中某规格 num=1,2 */
function selectSpec(num, liObj)
{
    goodsspec['spec' + num] = $(liObj).html();
    $(liObj).attr("class", "active");
    $(liObj).siblings(".active").attr("class", "");

    // 当有2种规格并且选中了第一个规格时，刷新第二个规格
    if (num == 1 && goodsspec.specQty == 2)
    {
        goodsspec.spec2 = null;
//        $(".aggregate").html("");
        $(".specifications:eq(1) a").remove();

        var spec2Values = goodsspec.getDistinctValues('spec2', goodsspec.spec1);
        for (var i = 0; i < spec2Values.length; i++)
        {
            $(".specifications:eq(1)").append("<a  onclick='selectSpec(2, this)'>" + spec2Values[i] + "</a>");
        }
    }
    else
    {
        var spec = goodsspec.getSpec();
        if (spec != null)
        {
            $("[ectype='current_spec']").html(spec.spec1 + ' ' + spec.spec2);
            $(".goodsPrice span.orange").html('<i>￥</i>'+spec.price);
            $(".goodsPrice del").html('<i>￥</i>'+spec.price1);
            $("[ectype='goods_stock']").html(spec.stock);
        }
    }
}
function slideUp_fn()
{
    $('.ware_cen').slideUp('slow');
}
$(function(){
    goodsspec.init();

    //放大镜效果/
    if ($(".jqzoom img").attr('jqimg'))
    {
        $(".jqzoom").jqueryzoom({ xzoom: 430, yzoom: 300 });
    }

    // 图片替换效果
    $('.ware_box li').mouseover(function(){
        $('.ware_box li').removeClass();
        $(this).addClass('ware_pic_hover');
        $('.big_pic img').attr('src', $(this).children('img:first').attr('src'));
        $('.big_pic img').attr('jqimg', $(this).attr('bigimg'));
    });

    //点击后移动的距离
    var left_num = -61;

    //整个ul超出显示区域的尺寸
    var li_length = ($('.ware_box li').width() + 6) * $('.ware_box li').length - 305;

    $('.right_btn').click(function(){
        var posleft_num = $('.ware_box ul').position().left;
        if($('.ware_box ul').position().left > -li_length){
            $('.ware_box ul').css({'left': posleft_num + left_num});
        }
    });

    $('.left_btn').click(function(){
        var posleft_num = $('.ware_box ul').position().left;
        if($('.ware_box ul').position().left < 0){
            $('.ware_box ul').css({'left': posleft_num - left_num});
        }
    });

    // 加入购物车弹出层
    $('.close_btn').click(function(){
        $('.ware_cen').slideUp('slow');
    });
});