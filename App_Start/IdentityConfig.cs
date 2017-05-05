using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using GSBWEB.Models;
using System;
using System.Security.Claims;

using SERVIF;

namespace GSBWEB
{
    // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.

    public class mUser : IUser
    {
        string IUser<string>.Id
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        string IUser<string>.UserName
        {
            get
            {
                throw new NotImplementedException();
            }

            set
            {
                throw new NotImplementedException();
            }
        }
    }
    public class mUserStore : IUserStore<mUser>
    {
        Task IUserStore<mUser, string>.CreateAsync(mUser user)
        {
            throw new NotImplementedException();
        }

        Task IUserStore<mUser, string>.DeleteAsync(mUser user)
        {
            throw new NotImplementedException();
        }

        void IDisposable.Dispose()
        {
            throw new NotImplementedException();
        }

        Task<mUser> IUserStore<mUser, string>.FindByIdAsync(string userId)
        {
            throw new NotImplementedException();
        }

        Task<mUser> IUserStore<mUser, string>.FindByNameAsync(string userName)
        {
            throw new NotImplementedException();
        }

        Task IUserStore<mUser, string>.UpdateAsync(mUser user)
        {
            throw new NotImplementedException();
        }
    }
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store)
            : base(store)
        {

        }
        public override Task<ApplicationUser> FindAsync(string userName, string password)
        {
            Task<ApplicationUser> task = Task<ApplicationUser>.Factory.StartNew(() =>
            {
                USER u = new USER();

                var result = u.Login(userName, password);

                if (result == null)
                {
                    return null;
                }
                else
                {
                    return new ApplicationUser()
                    {
                        UserName = result.USER_NAME
                    };
                }

            });

            return task;
            //return base.FindAsync(userName, password);            
        }
        public override Task<ClaimsIdentity> CreateIdentityAsync(ApplicationUser user, string authenticationType)
        {
            Task<ClaimsIdentity> task = Task<ClaimsIdentity>.Factory.StartNew(() =>
            {
                var ident = new ClaimsIdentity(authenticationType);

                var claim1 = new Claim(ClaimTypes.Name, user.UserName);
                var claim2 = new Claim(ClaimTypes.NameIdentifier, user.UserName);

                claim1.Properties.Add("test1", "test1");
                claim2.Properties.Add("test2", "test2");

                ident.AddClaim(claim1);
                ident.AddClaim(claim2);

                return ident;
            });


            return task;

            //return base.CreateIdentityAsync(user, authenticationType);
        }
        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<ApplicationUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };
            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }
    }
}
