// Constants and Storage Keys
const STORAGE_KEYS = {
    COMPLETED_SKILLS: 'skillRoulette_completedSkills',
    RATINGS: 'skillRoulette_ratings',
    DAILY_SKILL: 'skillRoulette_dailySkill'
};

// Skill database
const skillsDatabase = [
    // Creative Skills
    {
        id: 1,
        name: "Origami Crane",
        category: "creative",
        description: "Learn to fold a traditional paper crane in just a few minutes. This Japanese art form is both relaxing and rewarding.",
        timeRequired: "5-10 minutes",
        mediaUrl: "https://www.youtube.com/embed/KfnyopxdJXQ",
        resources: ["https://origami.me/crane/"],
        difficulty: "beginner"
    },
    {
        id: 2,
        name: "Basic Sketching",
        category: "creative",
        description: "Learn the fundamentals of sketching with basic shapes and lines.",
        timeRequired: "15 minutes",
        mediaUrl: "https://www.youtube.com/embed/ewMksAbgdBI",
        resources: ["https://www.artistsnetwork.com/art-mediums/beginner-sketching/"],
        difficulty: "beginner"
    },
    {
        id: 3,
        name: "Calligraphy Basics",
        category: "creative",
        description: "Start your journey into beautiful handwriting with basic calligraphy strokes.",
        timeRequired: "20 minutes",
        mediaUrl: "https://www.youtube.com/embed/sBoVGqiSzr4",
        resources: ["https://thepostmansknock.com/beginners-guide-modern-calligraphy/"],
        difficulty: "intermediate"
    },
    // Tech Skills
    {
        id: 4,
        name: "Basic Python Print",
        category: "tech",
        description: "Write your first Python program and learn the fundamental print statement.",
        timeRequired: "3-5 minutes",
        mediaUrl: "https://www.youtube.com/embed/x7X9w_GIm1s",
        resources: ["https://www.python.org/about/gettingstarted/"],
        difficulty: "beginner"
    },
    {
        id: 5,
        name: "HTML Basics",
        category: "tech",
        description: "Create your first webpage with basic HTML tags.",
        timeRequired: "10 minutes",
        mediaUrl: "https://www.youtube.com/embed/bWPMSSsVdPk",
        resources: ["https://www.w3schools.com/html/"],
        difficulty: "beginner"
    },
    // Fitness Skills
    {
        id: 6,
        name: "Basic Yoga Stretch",
        category: "fitness",
        description: "Simple yoga stretches for flexibility and stress relief.",
        timeRequired: "5 minutes",
        mediaUrl: "https://www.youtube.com/embed/4pKly2JojMw",
        resources: ["https://www.yogabasics.com"],
        difficulty: "beginner"
    },
    {
        id: 7,
        name: "Quick HIIT Workout",
        category: "fitness",
        description: "High-intensity interval training for quick cardio.",
        timeRequired: "7 minutes",
        mediaUrl: "https://www.youtube.com/embed/ZMO_XC9w7Lw",
        resources: ["https://www.self.com/story/quick-hiit-workout"],
        difficulty: "intermediate"
    },
    // Practical Skills
    {
        id: 8,
        name: "Tie a Tie",
        category: "practical",
        description: "Master the basic necktie knot.",
        timeRequired: "3-5 minutes",
        mediaUrl: "https://www.youtube.com/embed/xAg7z6u4NE8",
        resources: ["https://www.ties.com/how-to-tie-a-tie"],
        difficulty: "beginner"
    },
    {
        id: 9,
        name: "Basic Sewing",
        category: "practical",
        description: "Learn to sew a button and basic stitches.",
        timeRequired: "10 minutes",
        mediaUrl: "https://www.youtube.com/embed/1FknfumFPX8",
        resources: ["https://www.instructables.com/Basic-Hand-Sewing/"],
        difficulty: "beginner"
    }
];

// Global variables
let currentCategory = 'all';
let currentSkill = null;
let completedSkills = [];
let skillRatings = {};

// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadUserProgress();
    setupEventListeners();
    generateDailySkill();
    initializeRatings();
    checkAndShowWelcomeMessage();
}

function setupEventListeners() {
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            currentCategory = this.dataset.category;
            animateFilterChange(this);
        });
    });

    // Spin button
    document.getElementById('spinButton').addEventListener('click', spinForSkill);

    // Share button
    document.getElementById('shareButton').addEventListener('click', shareSkill);

    // Mark completed button
    document.getElementById('markCompleted').addEventListener('click', markSkillCompleted);

    // Rating stars
    setupRatingStars();
}

function setupRatingStars() {
    document.querySelectorAll('.stars i').forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            submitRating(rating);
            animateRating(this);
        });

        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            updateStarDisplay(rating, true);
        });

        star.addEventListener('mouseout', function() {
            updateStarDisplay(currentSkill?.rating || 0, false);
        });
    });
}

function spinForSkill() {
    const skillCard = document.getElementById('skillCard');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const spinButton = document.getElementById('spinButton');
    
    // Filter skills based on category
    const filteredSkills = currentCategory === 'all' 
        ? skillsDatabase 
        : skillsDatabase.filter(skill => skill.category === currentCategory);
    
    if (filteredSkills.length === 0) {
        showNotification('No skills available in this category yet!');
        return;
    }

    // Get random skill
    let randomSkill;
    do {
        randomSkill = filteredSkills[Math.floor(Math.random() * filteredSkills.length)];
    } while (filteredSkills.length > 1 && randomSkill.id === currentSkill?.id);

    currentSkill = randomSkill;
    
    // Show loading animation
    skillCard.style.opacity = '0';
    loadingSpinner.style.display = 'flex';
    spinButton.classList.add('spinning');
    
    // Simulate loading delay
    setTimeout(() => {
        displaySkill(randomSkill);
        loadingSpinner.style.display = 'none';
        spinButton.classList.remove('spinning');
        skillCard.style.opacity = '1';
    }, 1000);
}

function displaySkill(skill) {
    const skillCard = document.getElementById('skillCard');
    
    // Update skill card content with animation
    skillCard.style.transform = 'translateY(20px)';
    skillCard.style.opacity = '0';
    
    // Update content
    skillCard.querySelector('.skill-title').textContent = skill.name;
    skillCard.querySelector('.skill-description').textContent = skill.description;
    skillCard.querySelector('.time-required').textContent = `Time required: ${skill.timeRequired}`;
    
    // Set difficulty badge
    const difficultyBadge = skillCard.querySelector('.difficulty-badge');
    difficultyBadge.textContent = skill.difficulty.charAt(0).toUpperCase() + skill.difficulty.slice(1);
    difficultyBadge.className = `difficulty-badge difficulty-${skill.difficulty}`;
    
    // Handle media content
    updateMediaContent(skill);
    
    // Add resource links
    updateResourceLinks(skill);

    // Update completed status
    updateCompletedStatus(skill);

    // Update rating display
    updateRatingDisplay();
    
    // Show the card with animation
    skillCard.style.display = 'block';
    setTimeout(() => {
        skillCard.style.transform = 'translateY(0)';
        skillCard.style.opacity = '1';
    }, 50);
}

function updateMediaContent(skill) {
    const mediaContainer = document.querySelector('.skill-media');
    if (skill.mediaUrl.includes('youtube.com')) {
        mediaContainer.innerHTML = `
            <iframe 
                width="100%" 
                height="315" 
                src="${skill.mediaUrl}"
                title="${skill.name}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }
}

function updateResourceLinks(skill) {
    const resourceContainer = document.querySelector('.resource-links');
    resourceContainer.innerHTML = skill.resources.map(url => 
        `<a href="${url}" target="_blank" class="resource-link">
            <i class="fas fa-external-link-alt"></i> Learn More
        </a>`
    ).join('');
}

function updateCompletedStatus(skill) {
    const markCompletedBtn = document.getElementById('markCompleted');
    const isCompleted = completedSkills.includes(skill.id);
    markCompletedBtn.textContent = isCompleted ? '✓ Completed' : 'Mark as Completed';
    markCompletedBtn.disabled = isCompleted;
    markCompletedBtn.className = `action-btn ${isCompleted ? 'completed' : ''}`;
}

function loadUserProgress() {
    completedSkills = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_SKILLS) || '[]');
    updateCompletedCount();
}

function markSkillCompleted() {
    if (!currentSkill) return;

    if (!completedSkills.includes(currentSkill.id)) {
        completedSkills.push(currentSkill.id);
        localStorage.setItem(STORAGE_KEYS.COMPLETED_SKILLS, JSON.stringify(completedSkills));
        
        updateCompletedStatus(currentSkill);
        updateCompletedCount();
        showNotification('Skill completed! 🎉');
        
        // Animate completion
        const markCompletedBtn = document.getElementById('markCompleted');
        markCompletedBtn.classList.add('completion-animation');
        setTimeout(() => markCompletedBtn.classList.remove('completion-animation'), 1000);
    }
}

function updateCompletedCount() {
    const completedCount = document.getElementById('completedCount');
    completedCount.textContent = completedSkills.length;
    
    // Animate count change
    completedCount.classList.add('count-animation');
    setTimeout(() => completedCount.classList.remove('count-animation'), 500);
}

function generateDailySkill() {
    const today = new Date().toDateString();
    const storedSkill = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_SKILL) || '{}');
    
    if (storedSkill.date !== today) {
        const randomSkill = skillsDatabase[Math.floor(Math.random() * skillsDatabase.length)];
        const dailySkill = {
            date: today,
            skillId: randomSkill.id,
            skillName: randomSkill.name
        };
        localStorage.setItem(STORAGE_KEYS.DAILY_SKILL, JSON.stringify(dailySkill));
        
        const dailySkillElement = document.getElementById('dailySkill');
        dailySkillElement.textContent = randomSkill.name;
    } else {
        document.getElementById('dailySkill').textContent = storedSkill.skillName;
    }
}

function shareSkill() {
    const shareText = currentSkill 
        ? `Check out this awesome skill I found on Skill Roulette: ${currentSkill.name}!` 
        : 'Check out Skill Roulette - learn something new in minutes!';
    
    if (navigator.share) {
        navigator.share({
            title: 'Skill Roulette',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        const tempInput = document.createElement('input');
        document.body.appendChild(tempInput);
        tempInput.value = window.location.href;
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showNotification('Link copied to clipboard! 📋');
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Rating System Functions
function initializeRatings() {
    skillRatings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RATINGS) || '{}');
}

function submitRating(rating) {
    if (!currentSkill) return;

    skillRatings[currentSkill.id] = rating;
    localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(skillRatings));
    
    updateRatingDisplay();
    showNotification('Thanks for rating! ⭐');
}

function updateRatingDisplay() {
    if (!currentSkill) return;

    const rating = skillRatings[currentSkill.id] || 0;
    updateStarDisplay(rating, false);
    
    const ratingValue = document.querySelector('.rating-value');
    ratingValue.textContent = rating ? `${rating.toFixed(1)} / 5` : 'No ratings yet';
}

function updateStarDisplay(rating, isHover) {
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Animation Functions
function animateFilterChange(button) {
    button.classList.add('filter-animation');
    setTimeout(() => button.classList.remove('filter-animation'), 300);
}

function animateRating(star) {
    star.classList.add('rating-animation');
    setTimeout(() => star.classList.remove('rating-animation'), 300);
}

function checkAndShowWelcomeMessage() {
    if (!localStorage.getItem('welcomeShown')) {
        showNotification('Welcome to Skill Roulette! 👋 Spin to discover new skills!');
        localStorage.setItem('welcomeShown', 'true');
    }
}
