import { Component, AfterViewInit, ElementRef, ViewChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Typed from 'typed.js';
import confetti from 'canvas-confetti';
import { gsap } from 'gsap';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements AfterViewInit {
  @ViewChild('typingElement') typingElement!: ElementRef;
  @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;
  @ViewChild('voiceMsg') voiceMsg!: ElementRef<HTMLAudioElement>;
  @ViewChild('finalMessageElement') finalMessageElement!: ElementRef;

  // App Stages
  // 0: Password Gate, 1: Intro, 2: Welcome, 3: Timeline, 4: Map, 5: Quiz, 6: Gift, 7: Finale, 8: Gallery
  currentStep = signal(0); 
  isMusicPlaying = signal(false);
  isVoicePlaying = signal(false);
  showEasterEgg = signal(false);
  easterEggContent = signal('');
  
  // Password Logic
  password = signal('');
  isPasswordError = signal(false);
  correctPassword = 'salma'; // The special word

  // Intro Logic
  introMessages = ['Wait a second...', 'Someone special has a birthday today...', 'Are you ready?'];
  currentIntroMsg = signal(0);

  // Quiz Logic
  quizScore = signal(0);
  quizStep = signal(0);
  quizQuestions = [
    { q: 'When was our first date?', a: ['18/6', '15/6', '20/2'], correct: 0 },
    { q: 'What is my favorite thing about you?', a: ['Your smile', 'Your kindness', 'Everything'], correct: 2 },
    { q: 'When is our anniversary?', a: ['12/1', '25/07', '10/9'], correct: 1 }
  ];

  // Love Meter
  loveLevel = signal(0);

  memories = [
    { title: 'The Moment We Met', description: 'Everything changed the second I saw you.', img: 'assets/images/WhatsApp Image 2026-05-18 at 2.00.25 PM1.jpeg', lat: '10%', lng: '20%' },
    { title: 'Our First Date', description: 'I was so nervous, but you made it perfect.', img: 'assets/images/WhatsApp Image 2026-05-18 at 2.00.27 PM2.jpeg', lat: '30%', lng: '45%' },
    { title: 'Your Beautiful Smile', description: 'It lights up my darkest days.', img: 'assets/images/WhatsApp Image 2026-05-18 at 2.00.28 PM3.jpeg', lat: '60%', lng: '30%' },
    { title: 'Always Together', description: 'Through thick and thin, you are my rock.', img: 'assets/images/WhatsApp Image 2026-05-18 at 2.00.29 PM4.jpeg', lat: '80%', lng: '70%' },
  ];

  favoriteSpot = {
    title: "Our Cozy Corner: Kicker's Cafe ☕✨",
    description: "Located right next to Lutfi Shabarh Mosque on 23 July Street, this is our special haven. Every coffee shared here, every beautiful laugh, and every sweet hour we spend talking makes this the most romantic spot in Port Said.",
    img: 'assets/images/kickers.png',
    mapLink: 'https://maps.google.com?q=Kicker%E2%80%99s,%20%D8%A8%D8%AC%D9%88%D8%A7%D8%B1%20%D9%85%D8%B3%D8%AC%D8%AF%20%D9%84%D8%B7%D9%81%D9%8A%20%D8%B4%D8%A8%D8%A7%D8%B1%D8%A9,%20%D8%B4%D8%A7%D8%B1%D8%B9%2023%20%D9%8A%D9%88%D9%84%D9%8A%D9%88,%20El%20Sharq,%20Port%20Said%20Governorate%208574110&ftid=0x14f99da62d7097ef:0x40b30c88d4ba3289&entry=gps&shh=CAE&g_st=iw',
    lat: '48%',
    lng: '55%'
  };

  galleryImages = [
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.33 PM5.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.33 PM6.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.33 PM7.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.34 PM8.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.34 PM9.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.35 PM10.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.36 PM11.jpeg',
    'assets/images/WhatsApp Image 2026-05-18 at 2.00.36 PM12.jpeg',
  ];

  isGiftOpened = signal(false);

  ngAfterViewInit() {
    // Initial animations if needed
  }

  checkPassword() {
    if (this.password().toLowerCase() === this.correctPassword) {
      this.isPasswordError.set(false);
      this.playMusic(); // Turn on music by default
      this.nextStep();
      this.runIntro();
    } else {
      this.isPasswordError.set(true);
      gsap.fromTo('.password-box', { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
    }
  }

  runIntro() {
    let interval = setInterval(() => {
      if (this.currentIntroMsg() < this.introMessages.length - 1) {
        this.currentIntroMsg.update(v => v + 1);
      } else {
        clearInterval(interval);
        setTimeout(() => this.nextStep(), 1500);
      }
    }, 2000);
  }

  startSurprise() {
    this.nextStep();
    this.playMusic();
    setTimeout(() => this.initTypingEffect(), 100);
  }

  initTypingEffect() {
    if (this.typingElement) {
      new Typed(this.typingElement.nativeElement, {
        strings: ['Happy Birthday, Salma 🎉', 'My Love, My Life ❤️', 'Every day with you is a gift ✨'],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
      });
    }
  }

  initFinalMessage() {
    if (this.finalMessageElement) {
      new Typed(this.finalMessageElement.nativeElement, {
        strings: [
          'Dear Salma,^1000\n\nYou are the most incredible person I have ever known. Every day with you is a new adventure, a new reason to smile. You are my best friend, my soulmate, and my entire world.^1000\n\nOn your special day, I want you to know how much I love you. Always and forever.^2000\n\nHappy Birthday! ❤️'
        ],
        typeSpeed: 40,
        contentType: 'html',
        showCursor: false
      });
    }
  }

  playMusic() {
    if (this.bgMusic && !this.isMusicPlaying()) {
      this.bgMusic.nativeElement.play();
      this.isMusicPlaying.set(true);
    }
  }

  nextStep() {
    this.currentStep.update(v => v + 1);
    this.animateTransition();
    
    if (this.currentStep() === 2) {
      setTimeout(() => this.initTypingEffect(), 500);
    }
    if (this.currentStep() === 7) {
      this.launchFireworks();
      // Ensure element is in DOM before init
      setTimeout(() => {
        if (this.finalMessageElement) {
          this.initFinalMessage();
        } else {
          // Retry once if not found
          setTimeout(() => this.initFinalMessage(), 500);
        }
      }, 800);
    }
  }

  prevStep() {
    this.currentStep.update(v => v - 1);
    this.animateTransition();
  }

  openGift() {
    this.isGiftOpened.set(true);
    this.launchConfetti();
  }

  answerQuiz(index: number) {
    if (index === this.quizQuestions[this.quizStep()].correct) {
      this.quizScore.update(v => v + 1);
      this.launchConfetti();
    }
    
    if (this.quizStep() < this.quizQuestions.length - 1) {
      this.quizStep.update(v => v + 1);
    } else {
      // Go straight to Happy Birthday (Step 7), skipping Gift (Step 6)
      setTimeout(() => {
        this.currentStep.set(7);
        this.launchFireworks();
        setTimeout(() => this.initFinalMessage(), 500); 
      }, 1500);
    }
  }

  increaseLove() {
    if (this.loveLevel() < 100) {
      this.loveLevel.update(v => v + 10);
      gsap.to('.heart-meter', { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
      if (this.loveLevel() === 100) {
        this.launchConfetti();
      }
    }
  }

  launchConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6F91', '#D7A1E0', '#F0D55E']
    });
  }

  launchFireworks() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }

  animateTransition() {
    gsap.from('.step-container', {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'back.out(1.7)'
    });
  }

  toggleMusic() {
    if (this.bgMusic) {
      if (this.isMusicPlaying()) {
        this.bgMusic.nativeElement.pause();
      } else {
        this.bgMusic.nativeElement.play();
      }
      this.isMusicPlaying.update(v => !v);
    }
  }

  toggleVoice() {
    if (this.voiceMsg) {
      if (this.isVoicePlaying()) {
        this.voiceMsg.nativeElement.pause();
      } else {
        this.voiceMsg.nativeElement.play();
        if (this.isMusicPlaying()) this.toggleMusic(); // Pause music for voice
      }
      this.isVoicePlaying.update(v => !v);
    }
  }

  triggerEasterEgg(msg: string) {
    this.easterEggContent.set(msg);
    this.showEasterEgg.set(true);
    this.launchConfetti();
    setTimeout(() => this.showEasterEgg.set(false), 4000);
  }
}
