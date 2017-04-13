window.TD = window.TD || {};

TD.PageloadSpinner =
{
    attachPageLoadSpinner: function() {

        var body = jQuery('body');

        //Attach the spinner to links
        body.on('click', 'a', function(e) {
            var element = jQuery(this);
            var target = element.attr("target");
            var href = element.attr("href");

            //Spinner only for links that have the spinner attribute
            if (TD.PageloadSpinner.checkAttribute(element, 'data-spinner') == false) {
                return;
            }

            //No spinner for anchor links
            if (href.substring(0,1) == '#') {
                return;
            }

            //No spinner for links that open a new window (example PDF)
            if (target == "_new" || target == "_blank") {
                return;
            }

            //No spinner for AJAX links
            if (TD.PageloadSpinner.checkAjax(this) == true) {
                return;
            }

            //No spinner for links that have the attribute 'nospinner'
            if (TD.PageloadSpinner.checkAttribute(target, 'nospinner')) {
                return;
            }

            //Only show after 0.3 seconds delay
            setTimeout(TD.PageloadSpinner.showSpinner(e), 300);
        });

        //Attach the spinner to forms
        body.on('submit', 'form', function(e) {
            var currentTarget = e.currentTarget;

            //Spinner only for forms that have the spinner attribute
            if (TD.PageloadSpinner.checkAttribute(currentTarget, 'data-spinner') == false) {
                return;
            }

            //No spinner for forms that target another window
            if (TD.PageloadSpinner.checkAttribute(currentTarget, 'target')) {
                var target = jQuery(currentTarget).attr("target");
                if (target !== '' && target !== '_self' && target !== '_top') {
                    return;
                }
            }

            //No spinner for forms that have the attribute 'nospinner'
            if (TD.PageloadSpinner.checkAttribute(currentTarget, 'nospinner')) {
                return;
            }

            //Only show after 0.3 seconds delay
            setTimeout(TD.PageloadSpinner.showSpinner(e), 300);
        });
    },
    renderSpinner: function() {
        //Show the page load spinner
        jQuery('.pageload').show();
        jQuery('body').trigger('TD.pageloadspinner.start');
    },
    showSpinner: function(e) {
        //Get the type of element
        var eventType = e.type;

        //Don't submit form or follow link yet
        e.preventDefault();

        this.renderSpinner();

        //Redirect for links
        if (eventType == 'click') {
            var href = jQuery(e.currentTarget).attr("href");
            window.location.href = href;
        } else if (eventType == 'submit') {
            //Submit for forms
            e.currentTarget.submit();
        }

        //Reload the spinner (because IE freezes GIFs during a page load, thanks Microsoft)
        TD.PageloadSpinner.reloadSpinner();
    },
    hideSpinner: function() {
        jQuery('.pageload').hide();
        jQuery('body').trigger('TD.pageloadspinner.stop');
    },
    reloadSpinner: function() {
        //Get the background image url (absolute)
        var spinner = jQuery('.pageload-spinner');
        var backgroundImage = spinner.css('backgroundImage');

        //Append a random number to the image URL (so the browser is forced to reload it)
        var matches = backgroundImage.match(/"([^"]*)"/);
        var url = matches[1];
        var randomNumber = Math.random();
        var backgroundImageCss = "url('"+ url + "?" + randomNumber + "')";

        //Load the spinner background image into the CSS
        spinner.css({backgroundImage: backgroundImageCss});
    },
    checkAjax: function(e) {
        var href = jQuery(e).attr("href");
        var attributes = ['data-id', 'data-ajaxurl'];
        var attributeFound = false;

        //Simple check, with the href
        if (href == '#' || href == '') {
            return true;
        }

        //For some weird ajax calls
        if (href.indexOf('javascript:') == 0) {
            return true;
        }

        //Check if the element has any of these attributes
        attributes.forEach(function(attributeName) {
            if (TD.PageloadSpinner.checkAttribute(e, attributeName)) {
                attributeFound = true;
            }
        });

        //If any of those attributes are found, this would be an AJAX call
        if (attributeFound) {
            return true;
        }

        //Not an AJAX function if it reached here
        return false;
    },
    checkAttribute: function(element, attributeName) {
        var attribute = jQuery(element).attr(attributeName);
        if (typeof attribute !== typeof undefined && attribute !== false) {
            return true;
        } else {
            return false;
        }
    },
    escKeyListener: function() {
        jQuery(document).keyup(function (e) {
            if (e.keyCode == 27) {
                jQuery('.pageload').hide();
            }
        });
    }
};

jQuery(function() {
    TD.Pageloadspinner.renderSpinner();
    TD.Pageloadspinner.hideSpinner();
    TD.PageloadSpinner.attachPageLoadSpinner();
    TD.PageloadSpinner.escKeyListener();
});
