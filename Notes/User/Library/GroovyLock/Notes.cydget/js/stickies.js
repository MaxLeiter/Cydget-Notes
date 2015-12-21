
var STICKIES = (function () {
    var interval = 0; /** The amount of notes **/
    var active; /** If its currently active **/
    var initStickies = function initStickies() {
        /** The + button **/
        $(".add-sticky").click(function () { 
            interval++; /** It's a new button, so increment the amount of buttons **/
            createSticky();
        });
        initStickies = null; /** We just did this; why do it again? **/
    },

    openStickies = function openStickies() {
        initStickies && initStickies(); /** Kind of silly **/
        for (var i = 0; i < localStorage.length; i++) {
            try {
                createSticky(JSON.parse(localStorage.getItem(localStorage.key(i))));
            } catch (error) { } /** TOOD: Error handling? **/
        }
    },

    createSticky = function createSticky(data) {
        var dateTime = new Date().getTime();
        data = data || { id : dateTime, top : "40px", left : "40px", title : 'Note ' + interval, text : " "}
        var dateFromTime = new Date(JSON.parse(data.id));
        var formattedDate =  dateFromTime.getFullYear() + "-" + (dateFromTime.getMonth() + 1) + "-" + dateFromTime.getDate(); 
        var formattedTime = dateFromTime.getHours() + ":" + dateFromTime.getMinutes() + ":" + dateFromTime.getSeconds();
        return $("<div />", { 
            "class" : "sticky",
            'id' : data.id,
        })
        .prepend($("<div />", { 
            "class" : "sticky-header",
        } )
        .append($("<span />", { 
            "class" : "sticky-old", 
        //    text: "edit",
            
        }))
        .append($("<span />", {
            html : data.title,
            contentEditable: true,
            "class" : "sticky-title",
            keypress : markUnsaved
        }))
        .append($("<span />", { 
            "class" : "close-sticky", 
            text : "Delete", 
            click : function () { deleteSticky($(this).parents(".sticky").attr("id")); }
        })))
        .append($("<div />", { 
            html : data.text, 
            contentEditable : true, 
            "class" : "sticky-content proper-sticky-border ", 
            keypress : markUnsaved
        }))

        .append($("<div />", {
            "class": "sticky-footer",
        })
        .append($("<span />", {
            "class": "sticky-date",
            html : formattedDate,
        }))
        .append($("<span />", {
            "class": "sticky-status",
            text : 'saved'
        }))) 
        /*.resizable({
            stack : ".sticky",
            start : markUnsaved,
            stop : saveSticky,
            minHeight: 150,
            minWidth: 300,
          resize: function(event, ui) {
              ui.size.width = ui.originalSize.width;
              ui.size.height = ui.originalSize.height;
          }
      })*/
.draggable({ 
    handle : "div.sticky-header", 
    stack : ".sticky",
    start : markUnsaved,
    stop  : saveSticky  
})
.css({
    position: "absolute",
    "top" : data.top,
    "left": data.left
})
.focusout(saveSticky)
.appendTo(document.body);
},

deleteSticky = function deleteSticky(id) {
    localStorage.removeItem("sticky-" + id);
    $("#" + id).fadeOut(200, function () { 
        $(this).remove(); 
    });
},

saveSticky = function saveSticky() {
    var that = $(this),  sticky = (that.hasClass("sticky-status") || that.hasClass("sticky-title") || that.hasClass("sticky-content")) ? that.parents('div.sticky'): that,
   
    obj = {
        id  : sticky.attr("id"),
        top : sticky.css("top"),
        left: sticky.css("left"),
        title : sticky.find(".sticky-title").html(), 
        text: sticky.children(".sticky-content").html()
    }

        localStorage.setItem("sticky-" + obj.id, JSON.stringify(obj));  
        sticky.find(".sticky-status").text("saved");
    },

    markUnsaved = function markUnsaved() {
        var that = $(this), sticky = (that.hasClass("sticky-content") || that.hasClass("sticky-title")) ? that.parents("div.sticky") : that;
        sticky.find(".sticky-status").text("unsaved");
    }

    return {
        open   : openStickies,
        init   : initStickies,
        "new"  : createSticky,
        remove : deleteSticky,
        save : saveSticky
    };
}());

