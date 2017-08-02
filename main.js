+function () {
    function $(selector) {
        return document.querySelector(selector);
    }

    function Box(el, controller, options) {
        this.el = el;
        this.controller = controller;

        if (options.draggable !== false) {
            this.initDrag();
        }

        if (options.resizable !== false) {
            this.initResize();
        }

        this.bind();
    }

    Box.prototype = {

        initDrag: function () {
            var el = this.el;
            var box = this;

            var startX = 0;
            var startY = 0;

            function onDragStart(evt) {
                evt.stopPropagation();

                startX = evt.pageX;
                startY = evt.pageY;

                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', onDragEnd);
            }

            function onDrag(evt) {
                var deltaX = evt.pageX - startX;
                var deltaY = evt.pageY - startY;

                startX = evt.pageX;
                startY = evt.pageY;

                el.style.left = el.offsetLeft + deltaX + 'px';
                el.style.top = el.offsetTop + deltaY + 'px';

                box.controller.renderIndicator();
            }

            function onDragEnd(evt) {
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', onDragEnd);

                startX = 0;
                startY = 0;
            }

            el.addEventListener('mousedown', onDragStart);
        },

        initResize: function () {
            var el = this.el;
            var box = this;

            var startX = 0;
            var startY = 0;

            var i = document.createElement("i");
            i.className = 'resizer';
            el.appendChild(i);

            function onDragStart(evt) {
                evt.stopPropagation();

                startX = evt.pageX;
                startY = evt.pageY;

                document.addEventListener('mousemove', onDrag);
                document.addEventListener('mouseup', onDragEnd);
            }

            function onDrag(evt) {
                var deltaX = evt.pageX - startX;
                var deltaY = evt.pageY - startY;

                startX = evt.pageX;
                startY = evt.pageY;

                var startWidth = parseInt(document.defaultView.getComputedStyle(el).width, 10);
                var startHeight = parseInt(document.defaultView.getComputedStyle(el).height, 10);

                el.style.width = (startWidth + deltaX) + 'px';
                el.style.height = (startHeight + deltaY) + 'px';

                box.controller.renderIndicator();
            }

            function onDragEnd(evt) {
                document.removeEventListener('mousemove', onDrag);
                document.removeEventListener('mouseup', onDragEnd);

                startX = 0;
                startY = 0;
            }

            i.addEventListener('mousedown', onDragStart);
        },

        bind: function () {
            var el = this.el;
            var box = this;
        
            el.addEventListener('scroll', function () {
                box.controller.renderIndicator();
            });
        }
    };

    function Indicator(el, controller) {
        this.el = el;
        this.controller = controller;

        this.render();
    }

    Indicator.prototype = {
        render: function () {
            var $box = this.controller.box.el;

            this.el.querySelector('.scroll-width').innerHTML = $box.scrollWidth;
            this.el.querySelector('.scroll-height').innerHTML = $box.scrollHeight;
            this.el.querySelector('.offset-width').innerHTML = $box.offsetWidth;
            this.el.querySelector('.offset-height').innerHTML = $box.offsetHeight;
            this.el.querySelector('.client-width').innerHTML = $box.clientWidth;
            this.el.querySelector('.client-height').innerHTML = $box.clientHeight;
            this.el.querySelector('.offset-left').innerHTML = $box.offsetLeft;
            this.el.querySelector('.offset-top').innerHTML = $box.offsetTop;
            this.el.querySelector('.scroll-left').innerHTML = $box.scrollLeft;
            this.el.querySelector('.scroll-top').innerHTML = $box.scrollTop;
        }
    };

    function Controller($box, $indicator, options) {
        options = options || {};
        this.box = new Box($box, this, options);
        this.indicator = new Indicator($indicator, this, options);
    }

    Controller.prototype = {
        renderIndicator: function (offset) {
            this.indicator.render(offset);
        }
    };

    function renderWindowIndicator(evt) {
        var $wi = $('.window-indicator');
    
        $wi.querySelector('.client-width').innerHTML = document.documentElement.clientWidth;
        $wi.querySelector('.client-height').innerHTML = document.documentElement.clientHeight;
        $wi.querySelector('.inner-width').innerHTML = window.innerWidth;
        $wi.querySelector('.inner-height').innerHTML = window.innerHeight;
        $wi.querySelector('.outer-width').innerHTML = window.outerWidth;
        $wi.querySelector('.outer-height').innerHTML = window.outerHeight;
    }

    function renderMouseIndicator(evt) {
        if (!evt) {
            return;
        }

        var $mi = $('.mouse-indicator');

        $mi.querySelector('.screen-x').innerHTML = evt.screenX;
        $mi.querySelector('.screen-y').innerHTML = evt.screenY;
        $mi.querySelector('.offset-x').innerHTML = evt.offsetX;
        $mi.querySelector('.offset-y').innerHTML = evt.offsetY;
        $mi.querySelector('.client-x').innerHTML = evt.clientX;
        $mi.querySelector('.client-y').innerHTML = evt.clientY;
        $mi.querySelector('.page-x').innerHTML = evt.pageX;
        $mi.querySelector('.page-y').innerHTML = evt.pageY;
    }

    var controller = new Controller($('.box'), $('.box-indicator'));
    var containerController = new Controller(
        $('.container'),
        $('.container-indicator'),
        { resizable: false }
    );

    renderWindowIndicator()
    renderMouseIndicator()

    document.addEventListener('mousemove', renderMouseIndicator);
    window.addEventListener('resize', renderWindowIndicator);
}();
