// Notification System
function showNotification(title, message, nextPage = null) {
  const overlay = document.getElementById('notificationOverlay');
  const titleEl = overlay.querySelector('.notification-title');
  const messageEl = overlay.querySelector('.notification-message');
  const button = overlay.querySelector('.notification-button');

  titleEl.textContent = title;
  messageEl.textContent = message;

  // Store the next page to navigate to after notification
  if (nextPage) {
    button.onclick = () => {
      hideNotification();
      goToPage(nextPage);
    };
  } else {
    button.onclick = hideNotification;
  }

  overlay.classList.add('show');
}

function hideNotification() {
  const overlay = document.getElementById('notificationOverlay');
  overlay.classList.remove('show');
}

function goToPage(pageId) {
  // Hide booking confirmation if it's active
  const overlay = document.getElementById('bookingConfirmation');
  if (overlay) {
    overlay.classList.remove('active');
  }

  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
    if (page.id === pageId) {
      page.classList.add('active');
      page.classList.remove('hidden');
      
      // Initialize specific page features if needed
      if (pageId === 'classes') {
        // Ensure filters are reset when entering classes page
        const filterCheckboxes = document.querySelectorAll('input[name="class-type"]');
        filterCheckboxes.forEach(checkbox => checkbox.checked = false);
        filterClasses(); // Show all classes initially
      }
    } else {
      page.classList.remove('active');
      page.classList.add('hidden');
    }
  });
}

function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (email && password) {
    showNotification('Login Successful!', 'Welcome back to GymSphere.', 'home');
  } else {
    showNotification('Error', 'Please enter your email and password.');
  }
}

function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const repeatPassword = document.getElementById('signupPasswordRepeat').value;

  if (!name || !email || !password || !repeatPassword) {
    showNotification('Error', 'Please fill in all fields.');
    return;
  }

  if (password !== repeatPassword) {
    showNotification('Error', 'Passwords do not match.');
    return;
  }

  showNotification('Sign Up Successful!', 'Please log in to continue.', 'login');
}

// Load splash page first
window.onload = () => {
  goToPage('splash');
};

// Membership related functions
let selectedPlan = {
  name: '',
  price: 0
};

function updateProgress(step) {
  const steps = document.querySelectorAll('.step');
  steps.forEach((s, index) => {
    if (index + 1 <= step) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
}

function showStep(stepId) {
  const steps = document.querySelectorAll('.membership-step');
  steps.forEach(step => {
    if (step.id === stepId) {
      step.classList.remove('hidden');
    } else {
      step.classList.add('hidden');
    }
  });
}

function selectPlan(planName, price) {
  selectedPlan = {
    name: planName,
    price: price
  };

  // Update the details page with selected plan
  document.getElementById('selectedPlanName').textContent = planName;
  document.getElementById('selectedPlanPrice').innerHTML = `₱${price}<span>/per month</span>`;

  // Update the payment page
  const summaryItems = document.querySelectorAll('.summary-item span:first-child');
  summaryItems[0].textContent = `${planName} Membership`;
  const prices = document.querySelectorAll('.summary-item span:last-child');
  prices[0].textContent = `₱${price}`;
  prices[2].textContent = `₱${price}`;
  prices[3].textContent = `₱${price}`;
  document.querySelector('.recurring-info .price').textContent = `₱${price}`;

  // Move to next step
  updateProgress(2);
  showStep('userDetails');
}

function submitDetails() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const birthDate = document.getElementById('birthDate').value;

  if (!firstName || !lastName || !email || !phone || !birthDate) {
    alert('Please fill in all fields');
    return;
  }

  // Move to payment step
  updateProgress(3);
  showStep('payment');
}

function togglePaymentMethod(method) {
  const cardPayment = document.getElementById('cardPayment');
  const gcashPayment = document.getElementById('gcashPayment');

  if (method === 'card') {
    cardPayment.classList.remove('hidden');
    gcashPayment.classList.add('hidden');
  } else {
    cardPayment.classList.add('hidden');
    gcashPayment.classList.remove('hidden');
  }
}

function completeMembership() {
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
  
  if (paymentMethod === 'card') {
    const cardNumber = document.getElementById('cardNumber').value;
    const cardName = document.getElementById('cardName').value;

    if (!cardNumber || !cardName) {
      alert('Please fill in all payment details');
      return;
    }
  } else {
    const gcashNumber = document.getElementById('gcashNumber').value;

    if (!gcashNumber) {
      alert('Please enter your GCash number');
      return;
    }
  }

  // Update success message
  document.getElementById('finalPlan').textContent = selectedPlan.name;
  
  // Generate membership ID
  const today = new Date();
  const year = today.getFullYear();
  const randomNum = Math.floor(Math.random() * 1000);
  document.getElementById('memberId').textContent = `GS-${year}-${randomNum}`;

  // Calculate next payment date
  const nextPayment = new Date();
  nextPayment.setMonth(nextPayment.getMonth() + 1);
  document.getElementById('nextPayment').textContent = nextPayment.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Show success message
  showStep('success');
}

function submitContactForm(event) {
  event.preventDefault();
  
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;

  // Here you would typically send this data to a server
  showNotification('Message Sent!', 'Thank you for your message. We will get back to you soon.');
  
  // Clear the form
  document.getElementById('contactForm').reset();
}

// Profile Page Functions
function toggleProfileMenu(event) {
  if (event) {
    event.stopPropagation();
  }
  const profilePic = document.querySelector('.profile-picture');
  profilePic.classList.toggle('menu-active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.profile-picture')) {
    const profilePic = document.querySelector('.profile-picture');
    if (profilePic) {
      profilePic.classList.remove('menu-active');
    }
  }
});

function handleProfilePictureChange(event) {
  const file = event.target.files[0];
  if (file) {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      showNotification('Error', 'Please select an image file.');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('Error', 'Image size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      // Update the profile picture
      document.getElementById('profileImage').src = e.target.result;
      
      // Close the menu
      document.querySelector('.profile-picture').classList.remove('menu-active');
      
      showNotification('Success', 'Profile picture updated successfully!');
    };
    reader.readAsDataURL(file);
  }
}

function handlePasswordChange() {
  const currentPassword = document.querySelector('.password-setting input:nth-child(2)').value;
  const newPassword = document.querySelector('.password-setting input:nth-child(3)').value;
  const retypePassword = document.querySelector('.password-setting input:nth-child(4)').value;

  if (!currentPassword || !newPassword || !retypePassword) {
    showNotification('Error', 'Please fill in all password fields.');
    return;
  }

  if (newPassword !== retypePassword) {
    showNotification('Error', 'New passwords do not match.');
    return;
  }

  // Here you would typically send this to a server
  showNotification('Success', 'Password updated successfully!');
  
  // Clear the fields
  document.querySelectorAll('.password-setting input').forEach(input => input.value = '');
}

function handleGenderSelection(button) {
  // Remove active class from all gender buttons
  document.querySelectorAll('.gender-btn').forEach(btn => btn.classList.remove('active'));
  // Add active class to clicked button
  button.classList.add('active');
}

function handleProfileSave() {
  const firstName = document.querySelector('.name-inputs input:first-child').value;
  const lastName = document.querySelector('.name-inputs input:last-child').value;
  const birthdate = document.querySelector('input[placeholder="Enter your date of birth"]').value;
  const phone = document.querySelector('input[placeholder="Enter your number"]').value;
  const address = document.querySelector('input[placeholder="Enter your address"]').value;
  const gender = document.querySelector('.gender-btn.active')?.textContent || '';

  if (!firstName || !lastName || !birthdate || !phone || !address || !gender) {
    showNotification('Error', 'Please fill in all fields.');
    return;
  }

  // Update the name in the profile card
  const fullName = `${firstName} ${lastName}`;
  document.querySelector('.profile-card h2').textContent = fullName;

  showNotification('Success', 'Profile updated successfully!');
}

function handleLogout() {
  showNotification('Logging Out', 'See you next time!', 'login');
}

// Add event listeners when the profile page loads
document.addEventListener('DOMContentLoaded', () => {
  // Profile picture click handler
  const profilePic = document.querySelector('.profile-picture');
  if (profilePic) {
    profilePic.addEventListener('click', (e) => {
      // Don't toggle if clicking on the menu or its buttons
      if (!e.target.closest('.profile-picture-menu')) {
        profilePic.classList.toggle('menu-active');
        e.stopPropagation();
      }
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const profilePic = document.querySelector('.profile-picture');
    if (profilePic && !e.target.closest('.profile-picture')) {
      profilePic.classList.remove('menu-active');
    }
  });

  // Profile picture input change handler
  const profilePicInput = document.getElementById('profilePicInput');
  if (profilePicInput) {
    profilePicInput.addEventListener('change', handleProfilePictureChange);
  }

  // Password buttons
  document.querySelector('.password-setting .save-btn')?.addEventListener('click', handlePasswordChange);
  document.querySelector('.password-setting .cancel-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.password-setting input').forEach(input => input.value = '');
  });

  // Gender buttons
  document.querySelectorAll('.gender-btn').forEach(button => {
    button.addEventListener('click', () => handleGenderSelection(button));
  });

  // Save changes button
  document.querySelector('.save-changes-btn')?.addEventListener('click', handleProfileSave);

  // Logout button
  document.querySelector('.logout-btn')?.addEventListener('click', handleLogout);

  // Classes page initialization
  if (document.getElementById('classes')) {
    // Add filter functionality
    const filterCheckboxes = document.querySelectorAll('input[name="class-type"]');
    filterCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', filterClasses);
    });

    // Add booking functionality
    const bookButtons = document.querySelectorAll('.book-class');
    bookButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const className = e.target.closest('.class-card').querySelector('h4').textContent;
        bookClass(className);
      });
    });
  }

  // Profile page initialization
  if (document.getElementById('profilePicInput')) {
    document.getElementById('profilePicInput').addEventListener('change', handleProfilePictureChange);
  }
});

function removeProfilePicture() {
  const profileImage = document.getElementById('profileImage');
  // Set to default avatar image
  profileImage.src = 'default avatar.png';
  // Close the menu
  document.querySelector('.profile-picture').classList.remove('menu-active');
  showNotification('Success', 'Profile picture removed successfully!');
}

// Classes Page Functions
function filterClasses() {
  const selectedTypes = Array.from(document.querySelectorAll('input[name="class-type"]:checked'))
    .map(checkbox => checkbox.value);
  
  const classCards = document.querySelectorAll('.class-card');
  
  classCards.forEach(card => {
    const classType = card.querySelector('.class-type').textContent.toLowerCase();
    if (selectedTypes.length === 0 || selectedTypes.includes(classType.toLowerCase())) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function bookClass(className) {
  // Show the booking confirmation overlay
  const overlay = document.getElementById('bookingConfirmation');
  overlay.classList.add('active');
  
  // Optional: Hide overlay when clicking outside
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      goToPage('home');
    }
  });
}

// Class data
const classData = {
  'cardio': {
    type: 'CARDIO',
    name: 'BODY ATTACK',
    description: 'Cardio newbie or outright adrenaline junkie, it\'s the ultimate high-energy, whole-body workout that pushes every limit. It combines conventional athletic movements like running, lunging, jumping, with strength training exercises including push-ups and squats. Toning, shaping and strengthening the body while burning those calories.',
    intensity: 3,
    complexity: 3,
    duration: '50mins',
    schedule: 'TUESDAY - THURSDAY<br>5:30PM - 6:20PM',
    image: 'cardio.jpg'
  },
  'cycling': {
    type: 'CYCLING',
    name: 'SPIN CLASS',
    description: 'An intense cardio workout on a stationary bike that combines rhythm-based choreography with varying speeds and resistance. Perfect for building endurance and strength while burning maximum calories.',
    intensity: 4,
    complexity: 2,
    duration: '45mins',
    schedule: 'MONDAY - WEDNESDAY<br>7:00PM - 7:45PM',
    image: 'spinclass.webp'
  },
  'yoga': {
    type: 'MIND AND BODY',
    name: 'POWER YOGA',
    description: 'A vigorous, fitness-based approach to vinyasa-style yoga. A series of poses that will move you through the power of inhaling and exhaling. Builds internal heat, increases stamina, strength, and flexibility.',
    intensity: 2,
    complexity: 3,
    duration: '60mins',
    schedule: 'DAILY<br>7:00AM - 8:00AM',
    image: 'poweyoga.jpg'
  },
  'strength': {
    type: 'STRENGTH',
    name: 'CORE STRENGTH',
    description: 'Focus on building core strength and stability through targeted exercises. This class incorporates various equipment and bodyweight movements to strengthen your abs, back, and entire core region.',
    intensity: 3,
    complexity: 2,
    duration: '45mins',
    schedule: 'MONDAY - FRIDAY<br>2:00PM - 2:45PM',
    image: 'core.avif'
  }
};

let currentClass = '';

function showClassDetails(classType) {
  currentClass = classType;
  const data = classData[classType];
  const overlay = document.getElementById('classDetails');
  const header = overlay.querySelector('.class-details-header');
  
  // Update content
  header.style.backgroundImage = `url(${data.image})`;
  overlay.querySelector('.class-type-label').textContent = data.type;
  overlay.querySelector('.class-name').textContent = data.name;
  overlay.querySelector('.class-description p').textContent = data.description;
  
  // Update intensity dots
  const intensityDots = overlay.querySelectorAll('.info-item:nth-child(1) .level-dot');
  intensityDots.forEach((dot, index) => {
    dot.classList.toggle('active', index < data.intensity);
  });
  
  // Update complexity dots
  const complexityDots = overlay.querySelectorAll('.info-item:nth-child(2) .level-dot');
  complexityDots.forEach((dot, index) => {
    dot.classList.toggle('active', index < data.complexity);
  });
  
  // Update duration and schedule
  overlay.querySelector('.info-item:nth-child(3) p').textContent = data.duration;
  overlay.querySelector('.info-item:nth-child(4) p').innerHTML = data.schedule;
  
  // Show overlay
  overlay.classList.add('active');
}

function hideClassDetails() {
  document.getElementById('classDetails').classList.remove('active');
}

// Update class card click handlers
document.addEventListener('DOMContentLoaded', () => {
  const classCards = document.querySelectorAll('.class-card');
  classCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('book-class')) {
        const classType = card.getAttribute('data-class-type');
        showClassDetails(classType);
      }
    });
  });

  // Close overlay when clicking outside the card
  document.getElementById('classDetails').addEventListener('click', (e) => {
    if (e.target.classList.contains('class-details-overlay')) {
      hideClassDetails();
    }
  });
});

// Suggest Class Functions
function showSuggestClassForm() {
  const overlay = document.getElementById('suggestClassOverlay');
  overlay.classList.add('active');
}

function hideSuggestClassForm() {
  const overlay = document.getElementById('suggestClassOverlay');
  overlay.classList.remove('active');
}

function submitClassSuggestion(event) {
  event.preventDefault();
  
  const className = document.getElementById('className').value;
  const classType = document.getElementById('classType').value;
  const classDescription = document.getElementById('classDescription').value;
  const equipmentNeeded = document.getElementById('equipmentNeeded').value;

  // Here you would typically send this data to a server
  showNotification(
    'Thank You!',
    'Your class suggestion has been submitted. We will review it and get back to you soon.'
  );

  // Reset form and close overlay
  document.getElementById('suggestClassForm').reset();
  hideSuggestClassForm();
}

// Close overlay when clicking outside the form
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('suggestClassOverlay');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      hideSuggestClassForm();
    }
  });
});
