window.TD = window.TD || {};

TD.Utils =
{
    //Attach a page load spinner to buttons and forms
    attachPageLoadSpinner: function() {
        //Attach the spinner to links
        jQuery('a').on('click', function(e) {
            target = jQuery(this).attr("target")
            href = jQuery(this).attr("href");

            //Don't show spinner for links that open a new window
            if (target == "_new" || target == "_blank") {
                return;
            }

            //Don't show if the link doesn't have a href (example: not AJAX calls)
            if (href == '#' || href == '') {
                return;
            }

            e.preventDefault();
            //Only show after 0.3 seconds delay
            setTimeout(TD.Utils.showSpinner(href), 300);
        });

        //Attach the spinner to forms
        jQuery('form').on('submit', function(e) {
            //Only show after 0.3 seconds delay
            setTimeout(TD.Utils.showSpinner(), 300);
        });
    },
    showSpinner: function(href) {

        //default parameter is blank
        href = href || '';

        //Show the page load spinner
        jQuery('.pageload-spinner').show();

        //Redirect for links
        if (href !== '') {
            //Only now we redirect to the link
            window.location.href = href
        }
    }
};


jQuery(function() {
    TD.Utils.attachPageLoadSpinner();
});
