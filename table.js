/**
 * Package: htable.js
 * Function: htable 可锁定左侧列和表头
 * Author: liutao.
 * Date: 2017-04-07 14:00:00.
 */
(function(root,factory){
    factory(root.jQuery);
})(window,function($){
    var opts = {

    };

    function plugin(elm, data, options){
        var _this = this;

        //DOM节点
        _this.$elm = $(elm);
        _this.$lockLeftElm = $(elm).find('.lock-left');
        _this.$lockTopElm = $(elm).find('.lock-top');
        _this.$contentElm = $(elm).find('.table-content-box'); 
        
        
        
        _this.data = data;    //data包含两部分：left：左侧数据（包含表头），right：右侧数据（包含表头）；
        
        _this.opts = $.extend({}, opts, options);

        _this.init();
    }

    plugin.prototype = {
        init: function(){
            var _this = this;

            //数据视图渲染
            _this.render(_this.data);

            //视图事件监听
            _this.handle();

        },
        render: function(data){
            var _this = this,
                html = '';
                
            var lData = data.left,
                rData = data.right;
                
            var lLength = lData.length,
                rLength = rData.length;
            
            if(lLength){
                html += '<div class="m-lock-left">';
                
                    html += '<table class="table-corner" cellspacing="0" cellpadding="0" border="0">';
                        html += '<thead><tr>';
                            for(var i=0, l=lData[0].length; i<l; i++){
                                html += '<th>' + lData[0][i] + '</th>';
                            }
                        html += '</tr></thead>';
                    html += '</table>';
                
                    html += '<div class="lock-left">';
                        html += '<table class="table-left" cellspacing="0" cellpadding="0" border="0">';
                            html += '<thead><tr>';
                                for(var i=0; i<l; i++){
                                    html += '<th>' + lData[0][i] + '</th>';
                                }
                            html += '</tr></thead>';
                            html += '<tbody>';
                                for(var i=1; i<lLength; i++){
                                    html += '<tr>';
                                    for(var j=0; j<l; j++){
                                        html += '<td>' + lData[i][j] + '</td>';
                                    }
                                    html += '</tr>';    
                                }
                            html += '</tbody>';
                        html += '</table>';
                    html += '</div>';   
             
                html += '</div>';
            }
            if(rLength){
                html += '<div class="m-lock-right">';
                    html += '<div class="lock-top">';
                        html += '<table class="table-top" cellspacing="0" cellpadding="0" border="0">'; 
                            html += '<thead><tr>';    
                                for(var i=0, l=rData[0].length; i<l; i++){
                                    html += '<th>' + rData[0][i] + '</th>';
                                }
                            html += '</tr></thead>';
                        html += '</table>';
                    html += '</div>';
                    
                    html += '<div class="table-content-box">';
                        html += '<table class="table-content" cellspacing="0" cellpadding="0" border="0">'; 
                            html += '<thead><tr>';    
                                for(var i=0; i<l; i++){
                                    html += '<th>' + rData[0][i] + '</th>';
                                }
                            html += '</tr></thead>';
                            html += '<tbody>';
                                for(var i=1; i<rLength; i++){
                                    html += '<tr>';
                                    for(var j=0; j<l; j++){
                                        html += '<td>' + rData[i][j] + '</td>';
                                    }
                                    html += '</tr>';    
                                }
                            html += '</tbody>';
                        html += '</table>';
                    html += '</div>';
                html += '</div>';
            }
                
            _this.$elm.html(html);
        },
        handle: function(){
            var _this = this;
            
            //监听滚动条滚动事件
            _this.$elm.find('.table-content-box').scroll(function(){
                _this.$elm.find('.lock-top').scrollLeft($(this).scrollLeft());  
                _this.$elm.find('.lock-left').scrollTop($(this).scrollTop());
            });
            
            //计算DOM宽高
            _this.layout();
            $(window).resize(function(){
                _this.layout();
            });
        },
        layout: function(){
            var _this = this;
            
            var width = _this.$elm.width(),
                height = _this.$elm.height();
            
            //右侧宽度设置
            var leftWidth = _this.$elm.find('.m-lock-left').width();
            _this.$elm.find('.m-lock-right').width(width-leftWidth);
            
            
            var isScroll = _this.isScroll();
            if(isScroll.horizontal){
                _this.$elm.find('.lock-left').height(height-17);
            }
            if(isScroll.vertical){
                _this.$elm.find('.lock-top').width(width-leftWidth-17);
            }
        },
        isScroll: function(){    //判断table-content-box是否出现滚动条。
            var _this = this;
            
            var ret = {
                horizontal: false,    //横向
                vertical: false    //纵向
            };
            
            var tableBoxWidth = _this.$elm.find('.table-content-box').width(),
                tableBoxHeight = _this.$elm.find('.table-content-box').height();
            
            var tableWidth = _this.$elm.find('.table-content').width(),
                tableHeight = _this.$elm.find('.table-content').height();
                
            if(tableWidth >= tableBoxWidth){
                ret.horizontal = true;
            }    
            if(tableHeight >= tableBoxHeight){
                ret.vertical = true;
            }
            
            return ret;
        }
    };

    $.fn.htable = function(data, options){
        return new plugin(this, data, options);
    }
});