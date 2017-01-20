// hello.cc
#include <node.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <string>
#include <math.h>
#include <time.h>

const long long max_size = 10000;         // max length of strings
const long long N = 40;                  // number of closest words that will be shown
const long long max_w = 50;              // max length of vocabulary entries
namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

FILE *f;
char st1[max_size];
char *bestw[N];
char file_name[max_size], st[100][max_size];
float dist, len, bestd[N], vec[max_size];
long long words, size, a, b, c, d, cn, bi[100];
float *M;
char *vocab;
bool isModelSet = false;
time_t start;
struct tm tm;
double tick = -1;

int split(char **arr, char *str, const char *del) {
   char *s = strtok(str, del);
   int count = 0;
   while(s != NULL) {
     *arr++ = s;
     s = strtok(NULL, del);
     count ++;
   }
   return count;
}

bool ConsoleTime(const char *event)
{
    time_t tmp = time(NULL);
    if(tick != (tmp - start))
    {
      printf("%s", event);
      printf("%.f", difftime(tmp, start));
      tick = (tmp - start);
      return true;
    }
    return false;
}

void LoadModel(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "LoadModel has no params.\n"));
    return;
  }
  String::Utf8Value paraValue(args[0]->ToString()); //先把 args v8:Value 轉成 v8:String 再給 Utf8Value
  std::string paraString (*paraValue); // 然後把 Utf8Value 的 pointer 給 c++ string
  printf("Reading %s ....\n", paraString.c_str());
  start = time(NULL);
  f = fopen(paraString.c_str(), "rb");
  if (f == NULL) {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Input file not found\n"));
    return;
  }
  fscanf(f, "%lld", &words);
  fscanf(f, "%lld", &size);
  vocab = (char *)malloc((long long)words * max_w * sizeof(char));
  for (a = 0; a < N; a++) bestw[a] = (char *)malloc(max_size * sizeof(char));
  M = (float *)malloc((long long)words * (long long)size * sizeof(float));
  if (M == NULL) {
    printf("Cannot allocate memory: %lld MB    %lld  %lld\n", (long long)words * size * sizeof(float) / 1048576, words, size);
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Cannot allocate memory.\n"));
    return;
  }
  for (b = 0; b < words; b++) {
    a = 0;
    while (1) {
      vocab[b * max_w + a] = fgetc(f);
      if (feof(f) || (vocab[b * max_w + a] == ' ')) break;
      if ((a < max_w) && (vocab[b * max_w + a] != '\n')) a++;
    }
    vocab[b * max_w + a] = 0;
    for (a = 0; a < size; a++) fread(&M[a + b * size], sizeof(float), 1, f);

    len = 0; // normalizing
    for (a = 0; a < size; a++) len += M[a + b * size] * M[a + b * size];
    // if(ConsoleTime("")) printf(",%lld,%lld\n", b, size);
    len = sqrt(len);
    for (a = 0; a < size; a++) M[a + b * size] /= len; // normalizing
  }
  isModelSet = true;
  std::string result = "";
  result += paraString.c_str();
  result += " \n";
  // ConsoleTime("Loaded");
  printf("%s Loaded.\n", paraString.c_str());
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
}

void GetVectors(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "GetVector has no params.\n"));
    return;
  }
  if(!isModelSet)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Model is not set.\n"));
    return;
  }
  String::Utf8Value paraValue(args[0]->ToString()); //先把 args v8:Value 轉成 v8:String 再給 Utf8Value
  std::string paraString (*paraValue); // 然後把 Utf8Value 的 pointer 給 c++ string
  std::string result = "";
  char paraCString[max_size];
  strcpy(paraCString, paraString.c_str());
  int wordC = 0;
  char *arr[max_size];
  int wordsSize = split(arr, paraCString, ",");
  while(true){
    // result += std::to_string(strlen(arr[wordC])); // append word front;
    result += arr[wordC];
    result += ',';
    strcpy(st1, arr[wordC]);
    if(strlen(st1) > max_size-1)
    {
      args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Word size is too large.\n"));
      return;
    }
    cn = 0;
    b = 0;
    c = 0;
    while (1) {
      st[cn][b] = st1[c];
      b++;
      c++;
      st[cn][b] = 0;
      if (st1[c] == 0) break;
      if (st1[c] == ' ') {
        cn++;
        b = 0;
        c++;
      }
    }
    cn++;
    for (a = 0; a < cn; a++) {
      for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
      if (b == words) b = -1;
      bi[a] = b;
      // printf("%f\n", M[a + bi[a] * size]);
      // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
      if (b == -1) {
        result += "Out of dictionary word";
      }
    }
    if(b != -1)
    {
      for (a = 0; a < size; a++) vec[a] = 0;
      for (b = 0; b < cn; b++) {
        if (bi[b] == -1) continue;
        for (a = 0; a < size; a++) vec[a] += M[a + bi[b] * size];
      }
      for(a = 0; a < size; a++)
      {
        if(a == 0) result += std::to_string(vec[a]);
        else
        {
          result += ',' ;
          result += std::to_string(vec[a]);
        }
      }
    }
    wordC ++; // next word
    if(wordC < wordsSize)
    {
      result += "\n";
    }
    else
    {
      break;
    }
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
}

void GetSimilarWords(const FunctionCallbackInfo<Value>& args)
{
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "GetSimilarWords has no params.\n"));
    return;
  }
  if(!isModelSet)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Model is not set.\n"));
    return;
  }
  String::Utf8Value paraValue(args[0]->ToString()); //先把 args v8:Value 轉成 v8:String 再給 Utf8Value
  std::string paraString (*paraValue); // 然後把 Utf8Value 的 pointer 給 c++ string
  std::string result = "";
  for (a = 0; a < N; a++) bestd[a] = 0;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  strcpy(st1, paraString.c_str());
  if(strlen(st1) > max_size-1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Word byte is too large.\n"));
    return;
  }
  cn = 0;
  b = 0;
  c = 0;
  while (1) {
    st[cn][b] = st1[c];
    b++;
    c++;
    st[cn][b] = 0;
    if (st1[c] == 0) break;
    if (st1[c] == ' ') {
      cn++;
      b = 0;
      c++;
    }
  }
  cn++;
  for (a = 0; a < cn; a++) {
    for (b = 0; b < words; b++) if (!strcmp(&vocab[b * max_w], st[a])) break;
    if (b == words) b = -1;
    bi[a] = b;
    // printf("\nWord: %s  Position in vocabulary: %lld\n", st[a], bi[a]);
    if (b == -1) {
      result += st[a];
      result += ",Out of dictionary word.\n";
      args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
      return;
    }
  }
  for (a = 0; a < size; a++) vec[a] = 0;
  for (b = 0; b < cn; b++) {
    if (bi[b] == -1) continue;
    for (a = 0; a < size; a++) vec[a] += M[a + bi[b] * size];
  }
  len = 0;
  for (a = 0; a < size; a++) len += vec[a] * vec[a];
  len = sqrt(len);
  for (a = 0; a < size; a++) vec[a] /= len;
  for (a = 0; a < N; a++) bestd[a] = -1;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (c = 0; c < words; c++) {
    a = 0;
    for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
    if (a == 1) continue;
    dist = 0;
    for (a = 0; a < size; a++) dist += vec[a] * M[a + c * size];
    for (a = 0; a < N; a++) {
      if (dist > bestd[a]) {
        for (d = N - 1; d > a; d--) {
          bestd[d] = bestd[d - 1];
          strcpy(bestw[d], bestw[d - 1]);
        }
        bestd[a] = dist;
        strcpy(bestw[a], &vocab[c * max_w]);
        break;
      }
    }
  }
  result = "";
  for (a = 0; a < N; a++)
  {
    // printf("%s,%f\n", bestw[a], bestd[a]);
    result += bestw[a];
    result += ',';
    result += std::to_string(bestd[a]);
    if(a < N-1)
    {
      result += '\n';
    }
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
  return;
}
void GetNeighbors(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  if(args.Length() < 1)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "GetNeighbors has no params.\n"));
    return;
  }
  if(!isModelSet)
  {
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Model is not set.\n"));
    return;
  }
  String::Utf8Value paraValue(args[0]->ToString()); //先把 args v8:Value 轉成 v8:String 再給 Utf8Value
  std::string paraString (*paraValue); // 然後把 Utf8Value 的 pointer 給 c++ string
  std::string result = "";
  char paraCString[max_size];
  strcpy(paraCString, paraString.c_str());
  for (a = 0; a < N; a++) bestd[a] = 0;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  char *arr[max_size];
  split(arr, paraCString, ",");
  for (a = 0; a < size; a++)
  {
    vec[a] = atof(arr[a]);
  }
  cn = 1;
  b = 0;
  c = 0;
  len = 0;
  for (a = 0; a < size; a++) len += vec[a] * vec[a];
  len = sqrt(len);
  for (a = 0; a < size; a++) vec[a] /= len;
  for (a = 0; a < N; a++) bestd[a] = -1;
  for (a = 0; a < N; a++) bestw[a][0] = 0;
  for (c = 0; c < words; c++) {
    a = 0;
    for (b = 0; b < cn; b++) if (bi[b] == c) a = 1;
    if (a == 1) continue;
    dist = 0;
    for (a = 0; a < size; a++) dist += vec[a] * M[a + c * size];
    for (a = 0; a < N; a++) {
      if (dist > bestd[a]) {
        for (d = N - 1; d > a; d--) {
          bestd[d] = bestd[d - 1];
          strcpy(bestw[d], bestw[d - 1]);
        }
        bestd[a] = dist;
        strcpy(bestw[a], &vocab[c * max_w]);
        break;
      }
    }
  }
  for (a = 0; a < N;)
  {
    // printf("%s,%f\n", bestw[a], bestd[a]);
    result += bestw[a];
    result += ',';
    result += std::to_string(bestd[a]);
    a++;
    if(a < N)
    {
      result += '\n';
    }
  }
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result.c_str()));
  return;
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "Load", LoadModel);
  NODE_SET_METHOD(exports, "GetVectors", GetVectors);
  NODE_SET_METHOD(exports, "GetSimilarWords", GetSimilarWords);
  NODE_SET_METHOD(exports, "GetNeighbors", GetNeighbors);
}

NODE_MODULE(w2vLeeXun, init)
}  // namespace demo
