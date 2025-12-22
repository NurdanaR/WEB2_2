const btn = document.getElementById("btn");
const content = document.getElementById("content");

btn.onclick = async () => {
  content.innerHTML = "Loading...";

  try {
    const userRes = await fetch("/api/user");
    if (!userRes.ok) throw new Error("User API failed");
    const user = await userRes.json();

    const countryRes = await fetch(`/api/country/${user.country}`);
    if (!countryRes.ok) throw new Error("Country API failed");
    const country = await countryRes.json();

    const exchangeRes = await fetch(`/api/exchange/${country.currency}`);
    if (!exchangeRes.ok) throw new Error("Exchange API failed");
    const exchange = await exchangeRes.json();

    const newsRes = await fetch(`/api/news/${user.country}`);
    if (!newsRes.ok) throw new Error("News API failed");
    const news = await newsRes.json();

    content.innerHTML = `
      <div class="card">
        <img src="${user.picture}">
        <h3>${user.firstName} ${user.lastName}</h3>
        <p>Gender: ${user.gender}</p>
        <p>Age: ${user.age}</p>
        <p>DOB: ${user.dob}</p>
        <p>Address: ${user.address}, ${user.city}</p>
        <p>Country: ${user.country}</p>
      </div>

      <div class="card">
        <h3>${country.name}</h3>
        <img src="${country.flag}">
        <p>Capital: ${country.capital}</p>
        <p>Languages: ${country.languages.join(", ")}</p>
        <p>Currency: ${country.currency}</p>
        <p>1 ${country.currency} = ${exchange.USD} USD</p>
        <p>1 ${country.currency} = ${exchange.KZT === "N/A" ? "Not available" : exchange.KZT + " KZT"}
</p>

      </div>

      <div class="card news">
        <h3>News</h3>
        ${news.map(n => `
          <div>
            <h4>${n.title}</h4>
            ${n.image ? `<img src="${n.image}">` : ""}
            <p>${n.description || ""}</p>
            <a href="${n.url}" target="_blank">Read more</a>
          </div>
        `).join("")}
      </div>
    `;
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p style="color:red">Error: ${err.message}</p>`;
  }
};
