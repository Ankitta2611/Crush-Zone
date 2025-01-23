let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updateTransform = () => {
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const handleMouseMove = (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = this.mouseX - this.mouseTouchX;
      const dirY = this.mouseY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX ** 2 + dirY ** 2);

      if (dirLength > 0 && this.rotating) {
        const angle = Math.atan2(dirY, dirX);
        this.rotation = ((angle * 180) / Math.PI + 360) % 360;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        updateTransform();
      }
    };

    const handleMouseDown = (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;

      e.preventDefault();
      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      } else if (e.button === 2) {
        this.rotating = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!this.holdingPaper) return;

      const touch = e.touches[0];
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;

      this.currentPaperX = this.mouseX - this.mouseTouchX;
      this.currentPaperY = this.mouseY - this.mouseTouchY;

      updateTransform();
    };

    document.addEventListener('mousemove', handleMouseMove);
    paper.addEventListener('mousedown', handleMouseDown);

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch support
    paper.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      this.holdingPaper = true;

      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;

      paper.style.zIndex = highestZ++;
    });

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', () => {
      this.holdingPaper = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

