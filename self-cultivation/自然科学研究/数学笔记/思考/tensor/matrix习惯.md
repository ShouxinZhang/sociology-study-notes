$\bm{x}_{1:n} = \begin{bmatrix} x_1 \\ \vdots \\ x_n \end{bmatrix} \in \mathbb{C}^{n \times 1}, \quad \bm{x}_{1..n} = \begin{bmatrix} x_1 & \cdots & x_n \end{bmatrix} \in \mathbb{C}^{1 \times n}, \quad \bm{x}_{1:n}^{\mathrm{T}} = \bm{x}_{1..n}$

$\bm{X} = \begin{bmatrix} X_{1,1} & \cdots & X_{1,n} \\ \vdots & \ddots & \vdots \\ X_{m,1} & \cdots & X_{m,n} \end{bmatrix} = \begin{bmatrix} \bm{x}_{1..n}^{(1)} \\ \vdots \\ \bm{x}_{1..n}^{(m)} \end{bmatrix} = \begin{bmatrix} \bm{x}_{1:m}^{(1)} & \cdots & \bm{x}_{1:m}^{(n)} \end{bmatrix} \in \mathbb{C}^{m \times n}$

$\mathbf{1}_{n} = \begin{bmatrix} 1 \\ \vdots \\ 1 \end{bmatrix} \in \mathbb{R}^{n \times 1}, \quad \bm{I}_n = \begin{bmatrix} 1 & & 0 \\ & \ddots & \\ 0 & & 1 \end{bmatrix} \in \mathbb{R}^{n \times n}, \quad \bm{E}_{i,j} = \begin{bmatrix} 0 & \cdots & 0 & \cdots & 0 \\ \vdots & \ddots & \vdots & \ddots & \vdots \\ 0 & \cdots & 1_{(i,j)} & \cdots & 0 \\ \vdots & \ddots & \vdots & \ddots & \vdots \\ 0 & \cdots & 0 & \cdots & 0 \end{bmatrix}$

I usually write $e_{m;i}$ or $e_{m,i}$, where the entry preceding the delimiter denotes the hyperparameter (dimension) and the following denotes the index.
Convention recorded: $\bm{E}_{i,j} = e_{m;i} e_{n;j}^{\mathrm{T}} = e_{m,i} e_{n,j}^{\mathrm{T}} \in \mathbb{R}^{m \times n}$ with ambient dimension $m, n$ preceding basis index $i, j$.

$\operatorname{diag}(\bm{x}_{1..n}) = \begin{bmatrix} x_1 & & 0 \\ & \ddots & \\ 0 & & x_n \end{bmatrix}, \quad \bigoplus_{i=1}^k \bm{A}_i = \operatorname{diag}(\bm{A}_1, \dots, \bm{A}_k) = \begin{bmatrix} \bm{A}_1 & & \bm{0} \\ & \ddots & \\ \bm{0} & & \bm{A}_k \end{bmatrix}$

$\bm{X} = \begin{bmatrix} \bm{A} & \bm{B} \\ \bm{C} & \bm{D} \end{bmatrix} \implies \bm{X}^{\mathrm{T}} = \begin{bmatrix} \bm{A}^{\mathrm{T}} & \bm{C}^{\mathrm{T}} \\ \bm{B}^{\mathrm{T}} & \bm{D}^{\mathrm{T}} \end{bmatrix}, \quad \bm{X}^* = \begin{bmatrix} \bm{A}^* & \bm{C}^* \\ \bm{B}^* & \bm{D}^* \end{bmatrix}$

$\begin{bmatrix} \bm{A} & \bm{B} \\ \bm{C} & \bm{D} \end{bmatrix} \begin{bmatrix} \bm{u} \\ \bm{v} \end{bmatrix} = \begin{bmatrix} \bm{A}\bm{u} + \bm{B}\bm{v} \\ \bm{C}\bm{u} + \bm{D}\bm{v} \end{bmatrix}, \quad \begin{bmatrix} \bm{A} & \bm{B} \\ \bm{C} & \bm{D} \end{bmatrix} \begin{bmatrix} \bm{X}_{11} & \bm{X}_{12} \\ \bm{X}_{21} & \bm{X}_{22} \end{bmatrix} = \begin{bmatrix} \bm{A}\bm{X}_{11} + \bm{B}\bm{X}_{21} & \bm{A}\bm{X}_{12} + \bm{B}\bm{X}_{22} \\ \bm{C}\bm{X}_{11} + \bm{D}\bm{X}_{21} & \bm{C}\bm{X}_{12} + \bm{D}\bm{X}_{22} \end{bmatrix}$

$\det \begin{bmatrix} \bm{A} & \bm{0} \\ \bm{C} & \bm{D} \end{bmatrix} = \det(\bm{A})\det(\bm{D}), \quad \det \begin{bmatrix} \bm{A} & \bm{B} \\ \bm{C} & \bm{D} \end{bmatrix} = \det(\bm{D})\det(\bm{A} - \bm{B}\bm{D}^{-1}\bm{C})$

$\begin{bmatrix} \bm{A} & \bm{B} \\ \bm{0} & \bm{D} \end{bmatrix}^{-1} = \begin{bmatrix} \bm{A}^{-1} & -\bm{A}^{-1}\bm{B}\bm{D}^{-1} \\ \bm{0} & \bm{D}^{-1} \end{bmatrix}, \quad \begin{bmatrix} \bm{A} & \bm{0} \\ \bm{C} & \bm{D} \end{bmatrix}^{-1} = \begin{bmatrix} \bm{A}^{-1} & \bm{0} \\ -\bm{D}^{-1}\bm{C}\bm{A}^{-1} & \bm{D}^{-1} \end{bmatrix}$

$\bm{S} = \bm{A} - \bm{B}\bm{D}^{-1}\bm{C} \implies \begin{bmatrix} \bm{A} & \bm{B} \\ \bm{C} & \bm{D} \end{bmatrix}^{-1} = \begin{bmatrix} \bm{S}^{-1} & -\bm{S}^{-1}\bm{B}\bm{D}^{-1} \\ -\bm{D}^{-1}\bm{C}\bm{S}^{-1} & \bm{D}^{-1} + \bm{D}^{-1}\bm{C}\bm{S}^{-1}\bm{B}\bm{D}^{-1} \end{bmatrix}$

$\bm{A} \otimes \bm{B} = \begin{bmatrix} A_{1,1}\bm{B} & \cdots & A_{1,n}\bm{B} \\ \vdots & \ddots & \vdots \\ A_{m,1}\bm{B} & \cdots & A_{m,n}\bm{B} \end{bmatrix}, \quad \operatorname{vec}(\bm{X}) = \begin{bmatrix} \bm{x}_{1:m}^{(1)} \\ \vdots \\ \bm{x}_{1:m}^{(n)} \end{bmatrix} \in \mathbb{C}^{mn \times 1}$

$\operatorname{vec}(\bm{A}\bm{X}\bm{B}) = (\bm{B}^{\mathrm{T}} \otimes \bm{A})\operatorname{vec}(\bm{X}), \quad \operatorname{tr}(\bm{A}^{\mathrm{T}}\bm{B}) = \operatorname{vec}(\bm{A})^{\mathrm{T}}\operatorname{vec}(\bm{B})$

$|e_{1..n}\rangle = \begin{bmatrix} |e_1\rangle & \cdots & |e_n\rangle \end{bmatrix}, \quad \langle e_{1..n}| = \begin{bmatrix} \langle e_1| \\ \vdots \\ \langle e_n| \end{bmatrix}, \quad \langle e_{1..n}|e_{1..n}\rangle = \begin{bmatrix} \langle e_1, e_1\rangle_{\mathcal{H}} & \cdots & \langle e_1, e_n\rangle_{\mathcal{H}} \\ \vdots & \ddots & \vdots \\ \langle e_n, e_1\rangle_{\mathcal{H}} & \cdots & \langle e_n, e_n\rangle_{\mathcal{H}} \end{bmatrix}$

$\frac{\mathrm{d} \bm{f}}{\mathrm{d} \bm{x}^{\mathrm{T}}} = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_1}{\partial x_n} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_m}{\partial x_1} & \cdots & \frac{\partial f_m}{\partial x_n} \end{bmatrix} \in \mathbb{R}^{m \times n}, \quad \frac{\mathrm{d} \bm{f}}{\mathrm{d} \bm{x}} = \left(\frac{\mathrm{d} \bm{f}}{\mathrm{d} \bm{x}^{\mathrm{T}}}\right)^{\mathrm{T}} = \begin{bmatrix} \frac{\partial f_1}{\partial x_1} & \cdots & \frac{\partial f_m}{\partial x_1} \\ \vdots & \ddots & \vdots \\ \frac{\partial f_1}{\partial x_n} & \cdots & \frac{\partial f_m}{\partial x_n} \end{bmatrix} \in \mathbb{R}^{n \times m}$

---

For column vectors  and , the vector Kronecker product is the matrix Kronecker product specialized to column dimension 1:

$$
\bm{u} \otimes \bm{v} = \begin{bmatrix} u_1 \bm{v} \\ \vdots \\ u_m \bm{v} \end{bmatrix} = \begin{bmatrix} u_1 v_1 & \cdots & u_1 v_p & \cdots & u_m v_1 & \cdots & u_m v_p \end{bmatrix}^{\mathrm{T}} \in \mathbb{C}^{mp \times 1}
$$
Entrywise definition under lexicographical indexing $\alpha = (i - 1)p + k$:
$(\bm{u} \otimes \bm{v})_{(i - 1)p + k} = u_i v_k \quad (\forall i \in \{1, \dots, m\}, \, k \in \{1, \dots, p\})$
Standard basis mapping: $e_{m;i} \otimes e_{p;k} = \begin{bmatrix} \delta_{1,i} e_{p;k} \\ \vdots \\ \delta_{m,i} e_{p;k} \end{bmatrix} = \begin{bmatrix} \bm{0} , \cdots , e_{p;k} , \cdots , \bm{0} \end{bmatrix}^{\mathrm{T}} \in \mathbb{R}^{mp \times 1} = e_{mp; (i - 1)p + k}$, realizing the vector space isomorphism $\mathbb{C}^m \otimes \mathbb{C}^p \cong \mathbb{C}^{mp}$.

We certainly can; decomposing both yields the fine-grained scalar entry expansion rather than the block representation:
$\bm{A} = \sum_{i=1}^m \sum_{j=1}^n a_{i,j} \bm{E}_{m,n; i,j}, \quad \bm{B} = \sum_{k=1}^p \sum_{l=1}^q b_{k,l} \bm{E}_{p,q; k,l}$
$\implies \bm{A} \otimes \bm{B} = \sum_{i=1}^m \sum_{j=1}^n \sum_{k=1}^p \sum_{l=1}^q a_{i,j} b_{k,l} (\bm{E}_{m,n; i,j} \otimes \bm{E}_{p,q; k,l})$
$\bm{E}_{m,n; i,j} \otimes \bm{E}_{p,q; k,l} = (e_{m;i} e_{n;j}^{\mathrm{T}}) \otimes (e_{p;k} e_{q;l}^{\mathrm{T}}) = (e_{m;i} \otimes e_{p;k})(e_{n;j} \otimes e_{q;l})^{\mathrm{T}} = \bm{E}_{mp,nq; (i-1)p+k, (j-1)q+l}$
$\implies (\bm{A} \otimes \bm{B})_{(i-1)p+k, (j-1)q+l} = a_{i,j} b_{k,l}$
Decomposing only $\bm{A}$ highlights the coarse block structure $[a_{i,j}\bm{B}]$, whereas decomposing both $\bm{A}$ and $\bm{B}$ yields the canonical scalar basis expansion.
