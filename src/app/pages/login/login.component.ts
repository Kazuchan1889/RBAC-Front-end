import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  loginForm: FormGroup;

  isLoading = signal(false);
  showPassword = signal(false);
  loginError = signal('');
  loginSuccess = signal(false);
  formSubmitted = signal(false);

  private animationFrameId: number = 0;
  private particles: Particle[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  get emailControl(): AbstractControl {
    return this.loginForm.get('email')!;
  }

  get passwordControl(): AbstractControl {
    return this.loginForm.get('password')!;
  }

  get emailError(): string {
    const ctrl = this.emailControl;
    if (!this.formSubmitted() || ctrl.valid) return '';
    if (ctrl.hasError('required')) return 'Email is required';
    if (ctrl.hasError('email')) return 'Enter a valid email address';
    return '';
  }

  get passwordError(): string {
    const ctrl = this.passwordControl;
    if (!this.formSubmitted() || ctrl.valid) return '';
    if (ctrl.hasError('required')) return 'Password is required';
    if (ctrl.hasError('minlength')) return 'Minimum 6 characters required';
    return '';
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onSubmit(): Promise<void> {
    this.formSubmitted.set(true);
    this.loginError.set('');

    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    // Simulate API call
    await this.delay(2000);

    const { email, password } = this.loginForm.value;

    // Demo: accept any valid-format credentials
    if (email && password) {
      this.loginSuccess.set(true);
      await this.delay(1000);
      // Navigate to dashboard replacing current history context
      this.router.navigate(['/dashboard']);
      this.loginError.set('');
    } else {
      this.loginError.set('Invalid credentials. Please try again.');
    }

    this.isLoading.set(false);
  }

  async onSSOLogin(provider: string): Promise<void> {
    this.isLoading.set(true);
    await this.delay(800); // Simulate SSO redirect/auth delay
    this.loginSuccess.set(true);
    await this.delay(1000);
    this.router.navigate(['/dashboard']);
    this.isLoading.set(false);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ── Canvas Particle Animation ──────────────────────────────
  private initCanvas(): void {
    const canvas = this.canvasEl.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    this.particles = Array.from({ length: 60 }, () => new Particle(canvas));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of this.particles) {
        p.update(canvas);
        p.draw(ctx);
      }

      // Draw connections between close particles
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(this.particles[i].x, this.particles[i].y);
            ctx.lineTo(this.particles[j].x, this.particles[j].y);
            ctx.stroke();
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }
}

// ── Particle class ──────────────────────────────────────────
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  alphaDir: number;
  color: string;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.alphaDir = (Math.random() - 0.5) * 0.004;

    const colors = ['99, 102, 241', '139, 92, 246', '6, 182, 212', '167, 139, 250'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvas: HTMLCanvasElement): void {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha += this.alphaDir;

    if (this.alpha <= 0.05 || this.alpha >= 0.6) this.alphaDir *= -1;
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}
