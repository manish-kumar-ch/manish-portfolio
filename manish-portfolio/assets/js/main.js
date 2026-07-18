/* ============================================================
   Manish Kumar — portfolio scripts
   1. Animated WebGL2 shader background (recovered verbatim
      from the original site's build — "blue" variant)
   2. Contact form (mailto compose, same behavior as original)
   3. Scroll-reveal for sections
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. shader background ---------- */

  var VERTEX_SRC =
    "#version 300 es\n" +
    "precision highp float;\n" +
    "in vec4 position;\n" +
    "void main(){gl_Position=position;}";

  var FRAGMENT_SRC = [
    "#version 300 es",
    "precision highp float;",
    "out vec4 O;",
    "uniform vec2 resolution;",
    "uniform float time;",
    "#define FC gl_FragCoord.xy",
    "#define T time",
    "#define R resolution",
    "#define MN min(R.x,R.y)",
    "float rnd(vec2 p) {",
    "  p=fract(p*vec2(12.9898,78.233));",
    "  p+=dot(p,p+34.56);",
    "  return fract(p.x*p.y);",
    "}",
    "float noise(in vec2 p) {",
    "  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);",
    "  float",
    "  a=rnd(i),",
    "  b=rnd(i+vec2(1,0)),",
    "  c=rnd(i+vec2(0,1)),",
    "  d=rnd(i+1.);",
    "  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);",
    "}",
    "float fbm(vec2 p) {",
    "  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);",
    "  for (int i=0; i<5; i++) {",
    "    t+=a*noise(p);",
    "    p*=2.*m;",
    "    a*=.5;",
    "  }",
    "  return t;",
    "}",
    "float clouds(vec2 p) {",
    "  float d=1., t=.0;",
    "  for (float i=.0; i<3.; i++) {",
    "    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);",
    "    t=mix(t,d,a);",
    "    d=a;",
    "    p*=2./(i+1.);",
    "  }",
    "  return t;",
    "}",
    "void main(void) {",
    "  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);",
    "  vec3 col=vec3(0);",
    "  float bg=clouds(vec2(st.x+T*.5,-st.y));",
    "  uv*=1.-.3*(sin(T*.2)*.5+.5);",
    "  for (float i=1.; i<12.; i++) {",
    "    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);",
    "    vec2 p=uv;",
    "    float d=length(p);",
    "    col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);",
    "    float b=noise(i+p+bg*1.731);",
    "    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));",
    "    col=mix(col,vec3(bg*.05,bg*.14,bg*.32),d);", // blue variant
    "  }",
    "  O=vec4(col,1);",
    "}",
  ].join("\n");

  function initShaderBackground() {
    var canvas = document.getElementById("shader-bg");
    if (!canvas) return;

    var gl = canvas.getContext("webgl2");
    if (!gl) {
      // graceful fallback: static gradient
      canvas.style.background =
        "radial-gradient(ellipse at 50% 35%, rgba(48,128,255,.18), transparent 60%)";
      canvas.style.mixBlendMode = "normal";
      return;
    }

    var reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(sh));
      }
      return sh;
    }

    var program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX_SRC));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT_SRC));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );
    var pos = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    var uResolution = gl.getUniformLocation(program, "resolution");
    var uTime = gl.getUniformLocation(program, "time");

    // original renders at half device-pixel-ratio for performance
    var scale = Math.max(1, 0.5 * window.devicePixelRatio);

    function resize() {
      canvas.width = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", function () {
      resize();
      if (reducedMotion) render(4000); // repaint the single static frame
    });

    function render(t) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    if (reducedMotion) {
      render(4000); // one static frame, no animation loop
      return;
    }

    function loop(t) {
      render(t);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ---------- 2. contact form (same behavior as original) ---------- */

  var CONTACT_EMAIL = "manish2000chourasiya@gmail.com";

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var success = document.getElementById("contact-success");
    var errorEl = document.getElementById("contact-error");
    var backBtn = document.getElementById("contact-back");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      errorEl.textContent = "";
      errorEl.classList.add("hidden");

      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var email = String(data.get("email") || "").trim();
      var message = String(data.get("message") || "").trim();

      if (!name || !email || !message) {
        errorEl.textContent = "Name, email, and message are all required.";
        errorEl.classList.remove("hidden");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEl.textContent = "Please provide a valid email.";
        errorEl.classList.remove("hidden");
        return;
      }

      var subject = encodeURIComponent("Portfolio contact from " + name);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\n\n" + message
      );
      window.location.href =
        "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;

      form.classList.add("hidden");
      success.classList.remove("hidden");
    });

    backBtn.addEventListener("click", function () {
      success.classList.add("hidden");
      form.classList.remove("hidden");
    });
  }

  /* ---------- 3. scroll reveal ---------- */

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------- boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    initShaderBackground();
    initContactForm();
    initReveal();
  });
})();
