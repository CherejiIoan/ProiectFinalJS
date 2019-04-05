/* --------------------------------------------------------
Code for jquery.simpleLightbox()

version: 0.0.1
author: Thomas Schwarz
email: info@thomasschwarz-websolutions.de
website: https://www.thomasschwarz-websolutions.de
License: MIT
----------------------------------------------------------*/
(function ( $ ) {

    /*
    * _removeLightbox
    * Remove all open lightbox's.
    */
    var _removeLightbox = function() {

      // Get all elements.
      var elements = document.getElementsByClassName('sl-wrapper');

      // Check if we had elements.
      if (elements.length) {

        // Remove all.
        while(elements.length > 0) {
          elements[0].remove();
        }
      }
    }

    /*
    * _createStructure
    * Creates new HTML structure for the lightbox.
    */
    var _createStructure = function(link) {

      // Create new element and structure.
      var lightbox = document.createElement('div'),
          structure =
          '<div class="sl-content">' +
            '<span class="sl-close"></span>' +
            '<img src="' + link + '" alt="Simple Lightbox" />' +
          '</div>';

      // Set class for new element.
      lightbox.className = 'sl-wrapper';

      // Append structure for content.
      lightbox.innerHTML = structure;

      return lightbox;
    }

    /*
    * _openLightbox
    * Create and open the simple lightbox.
    */
    var _openLightbox = function(element, options) {

      // Remove all elements.
      _removeLightbox();

      // Create new lightbox.
      // -> get source of clicked element.
      var lightbox = _createStructure(element.getAttribute(options.source));

      // Append new lightbox to document.
      document.body.appendChild(lightbox);

      // Add event listener on the close button.
      document.querySelector('.sl-close')
      .addEventListener('click', _removeLightbox, false)
    }

    /*
    * simpleLightbox
    * plugin definition.
    */
    $.fn.simpleLightbox = function( options ) {

        // Set default options.
        var settings = $.extend({
            source: 'src',
            trigger: 'img'
        }, options );

        // Get all trigger elements by options.trigger.
        var triggerElements = document.querySelectorAll(settings.trigger);

        // Add event listener on trigger elements for click.
        for (var i = 0; i < triggerElements.length; i++) {
          triggerElements[i].addEventListener('click', function(element) {
             _openLightbox(element.target, settings);
           });
        }

        return this;
    };

}( jQuery ));
