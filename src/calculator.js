import $ from 'jquery';
import 'systematize';
import './style.scss';

// This gives us the order of the buttons, which we can use to step through the buttons in various directions.
// Since we know the layout, + 1 moves to the next item, -1 previous, +4 is one row down, -4 is one row up.
const buttonOrder = [
    '7',
    '8',
    '9',
    'Divide',
    '4',
    '5',
    '6',
    'Multiply',
    '1',
    '2',
    '3',
    'Add',
    '0',
    'Clear',
    'Equals',
    'Subtract'
].map(id => `#button${id}`);

const buttonCount = buttonOrder.length;

// Focus on an item. You can pass this any jQuery selector, such as #id or .class.
// Calling this will de-select anything currently selected.
const selectItem = name => {
    $('button').blur();
    $(name).focus();
};

// The next five functions move the selected UI control.
// This uses the array buttonOrder to know the order of the buttons.
// So you could change buttonOrder to change the order that controls are highlighted.
// If no button is currently selected, such as when the page loads, this will select the first
//   item in buttonOrder (which is the 7 button).
// selectNext: go to the right, wrapping around to the next row
// selectPrevious: go to the left, wrapping around to the previous row
// selectUp: select the item above
// selectDown: select the item below

const select = handleIndex => () => {
    // Get the currently selected button and return its id
    const focus = $(':focus');
    if (!focus.length) selectItem(buttonOrder[0]);
    else {
        let index = buttonOrder.indexOf(`#${focus.first().attr('id')}`);
        index = handleIndex(index);
        if (index < 0) index = buttonCount + index;
        selectItem(buttonOrder[index]);
    }
};

const selectNext = select(index => (index + 1) % buttonCount);
const selectPrevious = select(index => index - 1);
const selectUp = select(index => index - 4);
const selectDown = select(index => (index + 4) % buttonCount);

// Handle user key presses
$(document).keydown(({ keyCode }) => {
    switch (keyCode) {
        case 37:
            selectPrevious();
            break;
        case 38:
            selectUp();
            break;
        case 39:
            selectNext();
            break;
        case 40:
            selectDown();
            break;
        default:
            break;
    }
});

// Calculator constants
const radix = 10;
const digits = '0123456789';
const operators = '+-*/';

// Calculator state
let firstValue = null;
let operation = null;
let addingNumber = false;

const resetInput = () => $('input').val('');

const setFirstValue = () => {
    firstValue = $('input').val();
    addingNumber = false;
};

// Do the math for our calculator
const evaluateExpression = () => {
    let result = 0;

    const x = parseInt(firstValue, radix);
    const y = parseInt($('input').val(), radix);

    switch (operation) {
        case '+':
            result = x + y;
            break;
        case '-':
            result = x - y;
            break;
        case '*':
            result = x * y;
            break;
        case '/':
            result = x / y;
            break;
        default:
            return;
    }

    $('input').val(result.toString());
};

// Handle calculator functions. All buttons with class calcButton will be handled here.
$('.calcButton').click(function calculate() {
    const button = $(this).val();

    // If it's a number, add it to our display.
    if (digits.includes(button)) {
        // If we weren't just adding a number, clear our input.
        if (!addingNumber) resetInput();
        // Set input value.
        $('input').val($('input').val() + button);
        addingNumber = true;
        // If it's an operator, push the current value onto the stack.
    } else if (operators.includes(button)) {
        // Have we added a number? If so, check our stack.
        if (addingNumber) {
            // Do we have a number on the stack already? If so, this is the same as equals.
            if (firstValue) evaluateExpression();
            // Save the first number.
            setFirstValue();
        }
        // Save this as the most recent operation.
        operation = button;
    } else if (button === 'C') {
        // Clear expression
        resetInput();
        firstValue = null;
        operation = null;
        addingNumber = false;
    } else if (button === '=' && firstValue && operation && addingNumber) {
        // Evaluate expression
        evaluateExpression();
        // Clear our state
        firstValue = null;
        operation = null;
        addingNumber = true;
    }
});

// Prevent form submission
$('form').submit(event => event.preventDefault());

// Hot module reloading
if (module.hot) module.hot.accept();
