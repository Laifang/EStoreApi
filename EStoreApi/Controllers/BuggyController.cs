using EStoreApi.Controllers;
using Microsoft.AspNetCore.Mvc;


// 用于测试各种错误情况的控制器
public class BuggyController : BasicApiController
{

    [HttpGet("not-found")]
    public ActionResult GetNotFuound() => NotFound();

    [HttpGet("bad-request")]
    //
    public ActionResult GetBadRequest() => BadRequest(new ProblemDetails { Title = "Bad Request", Detail = "This is a bad request" });


    [HttpGet("unauthorized")]
    // Unauthorised access
    public ActionResult GetUnauthorized() => Unauthorized();


    // Valitation error
    [HttpGet("validation-error")]
    public ActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem1", "This is the first error");
        ModelState.AddModelError("Problem2", "This is the second error");
        return ValidationProblem();
    }


    // Internal server error
    [HttpGet("internal-server-error")]
    public ActionResult GetInternalServerError() => throw new Exception("This is an internal server error");


}