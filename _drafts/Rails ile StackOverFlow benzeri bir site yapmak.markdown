---
layout: post
title: "Rails ile StackOverFlow Uygulaması"
date: 2015-07-22T22:55:16+03:00
comments: true
tags: Ruby, Ruby_on_Rails
image: 
  feature: rubyrails.png
  show: true
---

## Rails'e Hoşgeldiniz

Rails [MVC][0] pattern'nini kullanan veritabanı destekli siteler oluşturmak için, ruby ile yazılmış bir freamwork'tür. 

Rails tam manasıyla MVC ye uyumlu olduğundan, MVC'yi anlamak, Rails'i anlamak demek olacaktır.

#TODO


Bu yazımda sıfırdan bir RoR projesi nasıl yapılır ondan bahsedeceğim. Uygulama stackoverflow benzeri yapıya sahip bir site yapacağım.

> **Yazıma başlamadan önce:**

> - Bu blog sayfasını kendimi geliştirken, bunu okuyanların da birşeyler kazanması için tutuyorum. Yazım yanlışlarım olabilir. Şimdiden, sürç-i lisan ettiysek affola.
> - Doğru olmadığını düşündüğünüz şeyler için yorum atabilir veya public olan github [reposu][1]  üzerinde issue oluşturabilirsiniz.
> - Anlatımlarımı Ubuntu 14.10 üzerinden yapacağım.

##Proje modellerinin tasarlanması

Herhangi bir projeye başlamadan önce, projenin hangi özelliklere sahip olması gerektiğini önceden belirleyip ona göre tablolar oluşturmalıyız.

Bizim yapacağımız uygulamada gerekenler: 

- Kullanıcı girişi
- Kullanıcıya ait sorular
- Kullanıcının verdiği cevaplar
- Kullanıcıya ait profil
- Sorulara ait etikeler
- Bunlara ait sayfalar ve tasarımları

Yapılacaklar listesini belirlediğimize göre, projemizde kullanacağımız tabloları belirleyelim ve UML modelleri çizelim.

<figure>
    <a href="http://yuml.me/765e70c9"><img src="http://yuml.me/765e70c9" alt="http://yuml.me/765e70c9"></a>
        Ana iskeleti oluşturacak modelleri belirledim. Gerekli görülmesi
    halide yeni modeller eklenebilir fakat ileride sorunlar yaşamamak için, bu tarz ön hazırlıklar proje başlamadan iyi düşünülüp hareket edilmeli.
</figure>



##Rails projesinin oluşturulması

{% highlight console %}
 $ rails new StackOverFlow_Clone -d mysql
{% endhighlight %}

> - Kod satırıda ki "-d" komutu database'in kısaltmasıdır. Ben veritabanı olarak mysql kullanıyorum.
> - Eğer "-d mysql" komutunu eklemezsek ön tanımlı olarak sqlite gem'i Gemfile dosyasına ekli olarak gelecek.

burada "StackOverFlow_Clone" yazan yere projeniz için vermek istediğiniz ismi yazın. Rails içinde kendine özgü dosyaların bulunduğu bir "StackOverFlow_Clone" adlı bir klasör oluşturacak.

gördüğünüz gibi bir çok klasor ve dosya oluşturdu. 

{% highlight console %}
    StackOverFlow_Clone/
    ├── app
    │   ├── assets
    │   │   ├── images
    │   │   ├── javascripts
    │   │   └── stylesheets
    │   ├── controllers
    │   ├── helpers
    │   ├── mailers
    │   ├── models
    │   └── views
    ├── bin
    ├── config
    ├── config.ru
    ├── db
    ├── Gemfile
    ├── Gemfile.lock
    ├── lib
    ├── log
    ├── public
    ├── Rakefile
    ├── README.rdoc
    ├── test
    ├── tmp
    └── vendor
{% endhighlight %}

> - **app ~>** uygulamamızı kodlarken en çok içinde bulunduğumuz ve Model-View-Contoller yapısı da içinde barındıran klasör.Diğer dosyalar ve klasörlerle ilgili olan bilgileri başka bir yazıya saklıyorum.

Gemfile dosyamızda ki **gem'leri****[^gem]**. kullanabilmek için server'ı başlatmadan önce:

{% highlight console %}
    $ cd StackOverFlow_Clone
{% endhighlight %}
{% highlight console %}
    $ bundle install
{% endhighlight %}

komutlarını yazıyoruz.

> Bundle, gem'leri  kurarken oluşan paket versiyon uyumsuzluğunu gidermek adına rails ile yüklenen bir pakettir.

şimdi aşağıda ki komut ile server'ı başlatalım.

{% highlight console %}
    $ rails server
{% endhighlight %}

> "rails server" yerine kısaca "rails s" yazmamız yeterli.

Bundan sonra yapmamız gereken herhangi bir tarayıcıyı açıp url kısmına **localhost:3000** yazmak.

<figure>
    <a href="../images/mysql-hatası.png"><img src="../images/mysql-hatası.png" alt=""></a>Böyle bir hata ile karşılaştıysanız, hatadan da anlaşılacağı gibi mysql bağlantısı için parolayı girmemişiz demektir.
</figure>

Veritabanı bağlantısı konfigürasyonu için  **_config/database.yml_** dosyasını açıyoruz. 

<div class="highlight">
  <pre>
    <code class="language-yaml" data-lang="yaml">
      <span class="o">default:</span><span class="nl">&amp;default</span>
        <span class="o">adapter:</span><span class="ss">mysql2</span>
        <span class="o">encoding:</span><span class="ss">utf8</span>
        <span class="o">pool:</span> <span class="ss">5</span>
        <span class="o">username:</span><span class="ss">root</span><span class="gp"># mysql kullanıcı adı</span>
        <span class="o">password:</span> <span class="ss">root</span><span class="gp">       # mysql parolası</span>
        <span class="o">socket:</span> <span class="ss">/var/run/mysqld/mysqld.sock</span>

      <span class="o">development:</span>
        <span class="o">&lt;&lt;:</span> <span class="nv">*default</span>
        <span class="o">database:</span> <span class="ss">todoApp_development # veritabanı ismi</span>
    </code>
  </pre>
</div>


Yazmış olduğumuz veritabanlarının mysql'de oluşturulması için aşağıda ki komutu yazıyoruz.

{% highlight console %}
    $ rake db:create
{% endhighlight %}

Server'ı tekrar başlatığımızda resimdeki gibi bir görüntü elde ediyorsak herşey yolunda demektir.

<figure>
    <a href="http://edgeguides.rubyonrails.org/images/getting_started/rails_welcome.png"><img src="http://edgeguides.rubyonrails.org/images/getting_started/rails_welcome.png" alt=""></a>
</figure>

> Bu sayfa rails'in bizim için yüklediği ön tanımlı açılış sayfasıdır.

##Model oluşturulası

Sitemizin ilk açılıştaki sayfası olan ve tüm soruları içeren sayfamız için, ilk olarak Question modelinden yavaş yavaş başlıyorum.

Öncelikle konsoldan model oluşturalım.

> **Model oluşturma**: rails g model {model_ismi} {kolon_ismi}:{tipi}

{% highlight console %}
    $ rails g model question title:string content:text 
{% endhighlight %}

>- "g" ile yazdığım generate'in kısaltmasıdır.
>- Eğer tip belirtilmemiş ise migration dosyasına default olarak string olarak yazılacaktır. 
>- **_Model isimleri tekil yazılır_**
>- Text, string tipine göre veritabanına daha çok karakter girilmesine izin verir.

Bu işlemden sonra rails 

- **app/model/question.rb**
- **db/migrate/YYYYAAGGSSDDSS_create_questions.rb**

şeklinde önemli iki dosya oluşturur.

> Migrate dosyası, Mysql için oluşturulacak tabloları tanımlayan özel ruby sınıflarını barındırır.

{% highlight ruby %}
class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :title
      t.text :content

      t.timestamps null: false
    end
  end
end

{% endhighlight %}

Burada **t.timestamps** şeklinde ifade edilen tip, questions tablosuna created_at ve update_at kolonlarını ekler. Her create ve update işleminde otomatik olarak veritabanına,  tarihleri kayıt eder.

Oluşturulan ruby sınıflarının, veri tabanında gerekli tabloları oluşturabilisi için terminale

{% highlight console %}
  $ rake db:migrate
{% endhighlight %}

yazıyoruz. Artık oluşturduğumuz her model ve migrate dosyasının veritabanında tablo oluşturabilmesi için bu komutu çalıştırmayı unutmayın.

##Routes ve Controller ile CRUD işlemleri

Şimdide tüm soruların görüntülenebileceği **_(index.html.erb)_**, yeni soruların oluşturulabileceği **_(new.html.erb)_**, sorunun içeriğinin görüntülenebileceği **_(show.html.erb)_** ve sorunun düzenlenebileceği **_(edit.html.erb)_** sayfaları yönetmek için bir adet controller ***(questions_controller.rb)*** oluşturacağız.

> **Controller oluşturma**: rails g controller {controller_ismi} {view'de oluşsacak sayfalar}

{% highlight console %}
    $ rails g controller questions index show new edit  
{% endhighlight %}

> Viewde oluşacak olan sayfa isimlerini yazdığımızda rails otomatik olarak oluşturur. Create, update ve destroy için bir html sayfasına ihtiyaç olmadığından bunları yazmadık.

Elimizde oluşturulmuş index.html.erb dosyası olduğuna göre artık burayı açılış sayfası yapabilirim ama şimdilik neler eklendiğini görmek için**config/routes.rb** dosyasını açıyorum.  

{% highlight ruby %}
  
Rails.application.routes.draw do
  get 'question/index'

  get 'question/show'

  get 'question/new'

  get 'question/edit'
end
{% endhighlight %}

> Routes, CRUD işlemleri için yönlenmeyi sağlayan yapıdır. 


Yukarıdaki kodları daha düzenli bir hale getirmek için **resources** kullanacağız. 

**Şimdilik ayrıntı:**

-----

*Böyle bir yapıyı controller'da kendiniz belirlediğiniz method'a yönlendirmek için kullanabilirsiniz.*

*Örnek vermek gerekirse:*

{% highlight ruby %}
    Rails.application.routes.draw do
      get 'archive' to: 'questions#archive'
    end
{% endhighlight %}

*Burada yaptığımız /archive sayfasının, questions_controller.rb dosyasındaki archive methodundan yararlamasını sağlamak.*

-----

{% highlight ruby %}
  
Rails.application.routes.draw do
  resources :questions
end
{% endhighlight %}

**resources**, CRUD işlemleri için tek tek yazmak yerine hepsini kapsayan bir yapıya sahiptir. Uygulamamızdaki yedi farklı yolu Qustions controller ile bağlaştırır. Unutmamak gerekirki resources methodu contollerdan bağımsız olarak pathleri oluşturur. Bu yüzden controller'daki kendi oluşturduğumuz methodlardan bağımsızdır. Bunun için yukarıda şimdilik ayrıtı diye anlattığım custom path oluşturma yöntemi ile yapabiliriz. 

<figure>
    <a href="../images/resources-questions.png"><img src="../images/resources-questions.png" alt=""></a>
</figure>


Şuan hangi path'lere sahip olduğumuza bakmak için konsola:

{% highlight console %}
  $ rake routes
{% endhighlight %}

yazıyoruz. Fakat yapı büyüdükçe path'lerimizde artacağı için konsoldan bakmakta zorlanacağız. Bunun için path'leri browserda da görmemizi sağlayan [sextant][2] gem'i Gemfile dosyamıza ekliyoruz.

> Gemfile dosyasına eklediğiniz her gem için **bundle install** yapmayı unutmayın.

<figure>
    <a href="../images/rails-routes.png"><img src="../images/rails-routes.png" alt=""></a>
</figure>

> Browser'da görüntüleyebilmek için [localhost:3000/rails/routes][3] yazıyoruz.

Artık bahsettiğimiz gibi view/questions/index.html.erb sayfasını açılış sayfası yapmak için config/routes.rb dosyasına **root "questions#index"** yazıyoruz.

{% highlight ruby %}
  
Rails.application.routes.draw do
  resources :questions

  root "questions#index"
end
{% endhighlight %}

Gerçektende olup olmadığına bakmak için url'ye [localhost:3000][4] yazıyorum.

<figure>
    <a href="../images/root-index.png"><img src="../images/root-index.png" alt=""></a>
</figure>

###Yönlenme

index sayfasına new sayfasına yönlenecek bir link verelim. Bunun için rails'in link_to methodunu kullanacağız.

{% highlight erb %}

  <h1>Question#index</h1>
  <%= link_to "Yeni Soru",  new_question_path %>
{% endhighlight %}

>- Html sayfasında ruby yazabilmek için **<% %>** etiketini kullanıyoruz. if, else, each, for , while vb. durumlarda bu şekilde yazılır. 
>- Eğer sayfada görünmesini istediğimiz bir kod varsa **<%=** şeklinde yazıyoruz.
>- link_to kullanımı için [bu][5] sayfayı inceleyebilirsiniz.

<figure class = "half">
    <a href="../images/new_question.png"><img src="../images/new_question.png"></a>
    <a href="../images/new_html.png"><img src="../images/new_html.png" alt=""></a>
</figure>

###Form

Yeni bir soru sorabilmek için input girişi ve gönder butonu olan bir form oluşturmamız lazım. Rails'in bize sunduğu bir diğer şey ise **form_for**.

> form_for kullanımı ile ilgili bilgiyi [buradan][6] alabilirsiniz.




--------------




[^gem]:Ruby ugulamalarına ektra özellikler katmak için yazılmış paketlere gem denir. Ör: mysql, devise, simple_form_for vs.

[0]: https://tr.wikipedia.org/wiki/Model-View-Controller
[1]: https://github.com/slhcnzl/slhcnzl.github.io/
[2]: https://github.com/schneems/sextant
[3]: http://localhost:3000/rails/routes
[4]: http://localhost:3000
[5]: http://api.rubyonrails.org/classes/ActionView/Helpers/UrlHelper.html#method-i-link_to
[6]: http://api.rubyonrails.org/classes/ActionView/Helpers/FormHelper.html