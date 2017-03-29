window.TD = window.TD || {};

TD.PageloadSpinner =
{
    attachPageLoadSpinner: function() {
        //Attach the spinner to links
        jQuery('a').on('click', function(e) {
            var target = jQuery(this).attr("target");

            //No spinner for links that open a new window (example PDF)
            if (target == "_new" || target == "_blank") {
                return;
            }

            //No spinner for AJAX links
            if (TD.PageloadSpinner.checkAjax(this) == true) {
                return;
            }

            //Only show after 0.3 seconds delay
            setTimeout(TD.PageloadSpinner.showSpinner(e), 300);
        });

        //Attach the spinner to forms
        jQuery('form').on('submit', function(e) {
            //No spinner for forms that target another window
            if (TD.PageloadSpinner.checkAttribute(e.currentTarget, 'target')) {
                var target = jQuery(e.currentTarget).attr("target");
                if (target !== '' && target !== '_self' && target !== '_top') {
                    return;
                }
            }

            //Only show after 0.3 seconds delay
            setTimeout(TD.PageloadSpinner.showSpinner(e), 300);
        });
    },
    showSpinner: function(e) {
        //Get the type of element
        var eventType = e.type;

        //Don't submit form or follow link yet
        e.preventDefault();

        //Show the page load spinner
        jQuery('.pageload').show();

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
    }
};

jQuery(function() {
    TD.PageloadSpinner.attachPageLoadSpinner();
});
