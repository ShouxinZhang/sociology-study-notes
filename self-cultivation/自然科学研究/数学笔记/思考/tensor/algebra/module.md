模（$A$-module）是向量空间的直接推广：将标量所属的数域放宽为一般的环 $A$。
它是一个配备标量乘法 $A \times M \to M, (a, x) \mapsto ax$ 的阿贝尔加法群 $(M, +)$。
满足分配律 $a(x+y)=ax+ay$、$(a+b)x=ax+bx$ 及相容性 $(ab)x=a(bx)$ 与 $1_A x=x$。

挠的定义：设 $M$ 为整环 $A$ 上的模。若存在非零标量 $a \in A \setminus \{0\}$ 使得 $a \cdot x = 0$，则称非零元 $x \in M$ 为挠元。（例如 $\mathbb{Z}/n\mathbb{Z}$ 中 $n \cdot \bar{1} = \bar{0}$）。
为何必非自由：自由模必须拥有线性无关基底 $\{e_i\}$。若存在非零挠元 $x \neq 0$（即 $ax = 0, a \neq 0$），将其按基底展开：
$$
x = \sum_i c_i e_i \implies ax = \sum_i (ac_i) e_i = 0 \implies ac_i = 0 \implies c_i = 0 \implies x = 0
$$
结论：导出矛盾。非零挠元的存在破坏了线性无关性与基底坐标的唯一性，故含非零挠的模绝非自由模。

域 $k$ 上的任何向量空间 $V$ 都是自由模，因而必然是无挠模（Torsion-free）。

有挠模（Torsion）：$\mathbb{Z}/n\mathbb{Z}$ (over $\mathbb{Z}$), $\mathbb{Q}/\mathbb{Z}$ (over $\mathbb{Z}$), $\mathbb{Z}_{p^\infty}$ (over $\mathbb{Z}$), $k[x]/(f(x))$ (over $k[x]$), $A/\mathfrak{a}$ (over 环 $A, \mathfrak{a}\neq 0$)。

无挠模（Torsion-free）：$\mathbb{Z}^n$ (over $\mathbb{Z}$), $\mathbb{Q}$ (over $\mathbb{Z}$), $k[x_1,\dots,x_n]$ (over $k$), $M_{m,n}(k)$ (over $k$), 理想 $\mathfrak{a} \subseteq A$ (over 整环 $A$)。

There exist modules that are torsion-free yet strictly non-free: $\mathbb{Z}$-模 $\mathbb{Q}$, 多项式环上的非主理想 $(x, y) \subset k[x, y]$.

---
1. 基底定义：设 $M$ 为环 $A$ 上的模。若子集 $B \subseteq M$ 线性无关且生成 $M$，则称 $B$ 为 $M$ 的一组基底（Basis）。
2. 自由模本质：拥有基底的模称为自由模（Free Module），其每个元素均可唯一写为基底的有限形式线性组合：
$$
M \cong A^{(B)} = \bigoplus_{b \in B} A \cdot b
$$
3. 结构对比：域上的向量空间必然是自由模；但一般环上的模未必有基（例如 $\mathbb{Z}$-模 $\mathbb{Z}/n\mathbb{Z}$ 因含挠元而无基、非自由）。
4. 泛性质：基底映射至任意 $A$-模 $N$ 的集合映射 $f_0: B \to N$，均可唯一延拓为模同态 $f: M \to N$。

---
自由模构造：取以笛卡尔积 $M \times N$ 为基生成的自由模 $A^{(M \times N)}$，基矢序对 $(x, y)$ 彼此正交独立。
约束子模提取：为强制实现双线性映射的 4 条法则，将所有非线性差值收集为极小子模 $D \subseteq A^{(M \times N)}$：
$$
D = \mathrm{span}_A \left\{
\begin{pmatrix}
(x + x', y) - (x, y) - (x', y) \\
(x, y + y') - (x, y) - (x, y') \\
(ax, y) - a(x, y) \\
(x, ay) - a(x, y)
\end{pmatrix}
\;\middle|\;
\begin{pmatrix}
x, x' \in M \\
y, y' \in N \\
a \in A
\end{pmatrix}
\right\}
$$
商模生成：定义张量积 $M \otimes_A N := A^{(M \times N)}/D$，元素 $x \otimes y := (x, y) + D$ 在商空间中自然满足全部双线性运算。
普遍性质：任意双线性映射 $f: M \times N \to P$ 诱导的同态满足 $D \subseteq \ker(\tilde{f})$，由商模同态定理唯一穿透为线性同态 $\bar{f}: C/D \to P$。
> 自由延拓 $\tilde{f}: A^{(M \times N)} \to P$：以序对 $(x, y)$ 为基底，将双线性映射 $f$ 形式线性延拓出的自由模同态，$\tilde{f}(\sum a_i (x_i, y_i)) = \sum a_i f(x_i, y_i)$。
> 商模穿透 $\bar{f}: M \otimes_A N \to P$：因 $D \subseteq \ker(\tilde{f})$，由商同态定理降维诱导出的唯一线性模同态，满足 $\bar{f}(x \otimes y) = f(x, y)$。

---
当 $V, W$ 为复 Hilbert 空间时，若未作特殊说明，默认是在**复数域 $\mathbb{C}$** 上的张量积：
$$
V \otimes W := V \otimes_{\mathbb{C}} W
$$
这保证了所有复标量 $a \in \mathbb{C}$ 都可以在张量积两侧自由穿透：
$$
(a x) \otimes y = a (x \otimes y) = x \otimes (a y) \quad (\forall a \in \mathbb{C})
$$