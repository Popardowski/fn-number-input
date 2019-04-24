(function(w,d){
 'use strict';

  var opt = {
        inputSelector: '.number-input',
        prettyInputClass: 'pretty-number-input',
        buttons: {
          increase: '.number-input-btn-increase',
          decrease: '.number-input-btn-decrease'
        },
        numberInputKeyupDelay: 100
      },
      numberInputTimer = 0,
      App = {
        init: function () {

          App.inputNumber(opt.inputSelector);

        },
        inputNumber: function (selector) {
          var $inputs = d.querySelectorAll(selector),
              displayErrorMsg = function ($input) {
                var $err = d.createElement('small'),
                    $errors = null;

                if ($input.parentNode) {
                  $errors = $input.parentNode.querySelectorAll('small');

                  if ($errors.length) {
                    $errors.forEach(function($error) {
                      $input.parentNode.removeChild($error);
                    });
                  } else {

                    if ($input.hasAttribute('data-error-msg-min') && $input.min.length && parseInt($input.value) <= parseInt($input.min)) {
                      $err.appendChild(d.createTextNode($input.getAttribute('data-error-msg-min')));
                      $input.parentNode.appendChild($err);
                    }
                    if ($input.hasAttribute('data-error-msg-max') && $input.max.length && parseInt($input.value) >= parseInt($input.max)) {
                      $err.appendChild(d.createTextNode($input.getAttribute('data-error-msg-max')));
                      $input.parentNode.appendChild($err);
                    }

                  }
                } // END if ($input.parentNode);
              },
              setMinValue = function (min, current) {
                return (parseInt(current) >= parseInt(min) ? current : min);
              },
              setMaxValue = function (max, current) {
                return (parseInt(current) >= parseInt(max) ? max : current);
              },
              setInputValue = function ($el) {
                if (!$el) { return false; }
                if ($el.min) {
                  $el.value = setMinValue($el.min, $el.value);
                }
                if ($el.max) {
                  $el.value = setMaxValue($el.max, $el.value);
                }
                displayErrorMsg($el);
              },
              btnActions = function ($input, increase, $btnIncrease, $btnDecrease) {
                var retValue = parseInt($input.value);

                if (increase) {
                  switch (increase) {
                    case 'increase':
                      retValue = ($input.step ? retValue + parseInt($input.step) : ++retValue);
                        break;
                    default:
                      retValue = ($input.step ? retValue - parseInt($input.step) : --retValue);
                  }
                }

                if ($input.min) {
                  retValue = setMinValue($input.min, retValue);
                  $btnDecrease.disabled = (parseInt(retValue) <= parseInt($input.min) ? true : false);
                }
                if ($input.max) {
                  retValue = setMaxValue($input.max, retValue);
                  $btnIncrease.disabled = (parseInt(retValue) >= parseInt($input.max) ? true : false);
                }

                $input.value = parseInt(retValue);
                displayErrorMsg($input);
              },
              inputActions = function (event) {
                clearTimeout(numberInputTimer);
                numberInputTimer = setTimeout(setInputValue, (opt.numberInputKeyupDelay ? opt.numberInputKeyupDelay : 100), event.target);
              },
              prettyInputButtons = function ($input, $parent) {
                var $btnIncrease = $parent.querySelector(opt.buttons.increase),
                    $btnDecrease = $parent.querySelector(opt.buttons.decrease);

                $btnIncrease.addEventListener('click', function (event) {
                  btnActions($input, 'increase', $btnIncrease, $btnDecrease);
                  Fn.preventDefault(event);
                }, false);
                $btnDecrease.addEventListener('click', function (event) {
                  btnActions($input, 'decrease', $btnIncrease, $btnDecrease);
                  Fn.preventDefault(event);
                }, false);
                $input.addEventListener('change', function (event) {
                  btnActions($input, false, $btnIncrease, $btnDecrease);
                }, false);
                $input.addEventListener('keyup', function (event) {
                  clearTimeout(numberInputTimer);
                  numberInputTimer = setTimeout(function() {
                    btnActions($input, false, $btnIncrease, $btnDecrease);
                  }, (opt.numberInputKeyupDelay ? opt.numberInputKeyupDelay : 100));
                }, false);
              };

          if (!$inputs) { return false; }
          $inputs.forEach(function($input){

            if ($input.parentNode && $input.parentNode.classList.contains(opt.prettyInputClass)) {
              prettyInputButtons($input, $input.parentNode);
            } else {
              $input.addEventListener('change', inputActions, false);
              $input.addEventListener('keyup', inputActions, false);
            }

          });
        } // END App.inputNumber(selector);
      },
      Fn = {
        // PREVENT DEFAULT EVENTS;
        preventDefault: function(e){
          e = e || w.event;
          if(e.preventDefault){ e.preventDefault(); }
          else{ e.returnValue = false; }
        } // END Fn.preventDefault(e);
      };

  w.addEventListener('load', App.init, false);

})(window, document);