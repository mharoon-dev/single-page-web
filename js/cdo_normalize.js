function otherClickHandler(container) {
  console.log('otherClickHandler');
  const otherAmountInput = container.querySelector('.form-radio-other-input');
  if (otherAmountInput.disabled) {
    container.querySelector('.form-radio-other').click();
    container.querySelector('.form-radio-other-input').focus();
  }
}

function handleOtherAmount() {
  const other = document.querySelector('.form-radio-other-input');
  if (other) {
    const container = other.closest('.form-radio-item');
    container.classList.add('other-amount-container');
    container.addEventListener('click', () => otherClickHandler(container));
  }
}

function hsMinisiteClass() {
  if (document.querySelector('.navLogo img')?.alt?.includes('Hebrew School')) {
    document.body.classList.add('hs-minisite');
  }
}

function addAidClass() {
  var path = window.location.pathname;
  var matches = path && path.match(/eventid\/(\d+)/);
  if (path.includes('ArticleCcoResponse')) document.body.classList.add('form-auto-response');
  var aid = Co && Co.ArticleId;
  if (matches && matches.length > 1) {
    var eventClass = 'eventid-' + matches[1];
    document.body.classList.add(eventClass);
    document.body.classList.add('event-page');
  } else {
    document.body.classList.add('aid-' + aid);
  }
};

function fixHebrewFormAlignment() {
  if (document.body.classList.contains('dir_rtl')) {
    const formAllEl = document.querySelector('.form-all.dir_ltr');
    if (formAllEl) {
      formAllEl.classList.remove('dir_ltr');
      formAllEl.classList.add('dir_rtl');
    }
  }
}

function removeEmptyAd() {
  const noRecords = document.getElementById("noRecordsText");
  if (noRecords) {
    noRecords.closest(".hp-row").style.display = "none";
  }
}

const MONTHS_REGEX = /jan|feb|march|apr|may|jun|july|aug|sep|oct|nov|dec/i;
const MULTIDATE_SAME_MONTH_REGEX = /\d{1,2}\s{0,1}\-\s{0,1}(\d{1,2})/;

function hideExpiredPromo() {
  const featureContainer = document.querySelector('.hp-row.hp-row-first + .hp-row .banner-updates');
  if (!featureContainer) return;
  const subtitles = featureContainer.querySelectorAll('.subtitle');


  subtitles.forEach(el => {
    let dateText = el.innerText;
    if (!MONTHS_REGEX.test(dateText)) return;
    dateText = dateText.replace(MULTIDATE_SAME_MONTH_REGEX, "$1");
    if (dateText.includes('-')) dateText = dateText.split('-')[1];
    const expiryDate = new Date(dateText + ` ${new Date().getFullYear()}`);
    console.log({expiryDate});
    expiryDate.setDate(expiryDate.getDate() + 1);
    if (Date.now() > expiryDate) {
      el.closest('.item').classList.add('promo-expired');
    }
  });

  const nonExpiredSubtitles = featureContainer.querySelectorAll('.item:not(.promo-expired) .subtitle');
  if (nonExpiredSubtitles.length < 1 && subtitles.length > 0) {
    featureContainer.closest('.hp-row').style.display = 'none';
  }
}

const copyAddress = (e) => {
  e.target.parentElement.style.display = 'none';

  const address = document.querySelector('.form-address-table .form-address-line');
  const city = document.querySelector('.form-address-table .form-address-city');
  const state = document.querySelector('.form-address-table .form-address-state');
  const postal = document.querySelector('.form-address-table .form-address-postal');

  document.querySelector('.billing_address .form-address-line').value = address.value;
  document.querySelector('.billing_address .form-address-city').value = city.value;
  document.querySelector('.billing_address .form-address-state').value = state.value;
  document.querySelector('.billing_address .form-address-postal').value = postal.value;
};

const addCopyAddressCheckbox = () => {
  const formAddress = document.querySelectorAll('.form-address-table');
  const billingAddressHeader = document.querySelector('.billing_address th');
  if (formAddress.length < 2 || !billingAddressHeader) return;

  // add a copy address checkbox to billing header
  // checkbox should be on new line with clear text explaining its function
  const copyAddressDiv = document.createElement('div');
  copyAddressDiv.classList.add('copy-address');
  copyAddressDiv.innerHTML = `
  <input type="checkbox" id="copyAddress" />
    <label for="copyAddress">Copy address from above</label>
  `;
  billingAddressHeader.appendChild(copyAddressDiv);

  // add event listener to checkbox
  const copyAddressCheckbox = document.getElementById('copyAddress');
  copyAddressCheckbox.addEventListener('change', copyAddress);

  const observer = new MutationObserver((mutationsList) => {
    const VALIDATE_CLASS = 'validate[required]';
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        // Check if the class you want to remove is added
        if (copyAddressCheckbox.classList.contains(VALIDATE_CLASS)) {
          console.log('Class "my-class" added. Removing it...', VALIDATE_CLASS);
          copyAddressCheckbox.classList.remove(VALIDATE_CLASS);
        }
      }
    }
  });
  
  // Configure the observer
  observer.observe(copyAddressCheckbox, { attributes: true });
  
};

const addNumeric = () => {
  const form = document.querySelector('.userform-form');
  if (!form) return;

  const inputs = form.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.inputMode = 'numeric'
  });
};

function init() {
  addAidClass();
  handleOtherAmount();
  // hsMinisiteClass();
  fixHebrewFormAlignment();
  // removeEmptyAd();
  addCopyAddressCheckbox();
  addNumeric();

  if (window.location.pathname === '/') {
    hideExpiredPromo();
  }
}

if (document.readyState !== 'loading'){
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}
